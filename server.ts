import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';
import passport from 'passport';
import { Strategy } from 'passport-oauth2';
import { environment } from './environment.prod';

interface PipedriveStrategyCallback {
  (
    err: any,
    accessToken: string | null,
    refreshToken: string | null,
    profile: any
  ): void;
}

export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  server.get('/auth/pipedrive/callback', (req, res, next) => {
    passport.authenticate(
      'pipedrive',
      { session: false },
      (
        err: any,
        accessToken: string | null,
        refreshToken: string | null,
        profile: any
      ) => {
        if (err) {
          console.error('Authentication error:', err);
          return res.redirect('/auth-error');
        }

        if (!accessToken || !refreshToken) {
          return res.redirect('/auth-error');
        }

        // To enhance security it's better to store them in secure cookies or send via headers
        return res.send(`
        <script>
           const accessToken = '${accessToken}';
           const refreshToken = '${refreshToken}';
           localStorage.setItem('access_token', accessToken);
           localStorage.setItem('refresh_token', refreshToken);
           window.location.href = '/'; 
        </script>
      `);
      }
    )(req, res, next);
  });

  passport.use(
    'pipedrive',
    new Strategy(
      {
        authorizationURL: 'https://oauth.pipedrive.com/oauth/authorize',
        tokenURL: 'https://oauth.pipedrive.com/oauth/token',
        clientID: environment.clientID,
        clientSecret: environment.clientSecret,
        callbackURL: environment.callbackURL,
      },
      async (
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: PipedriveStrategyCallback
      ) => {
        done(null, accessToken, refreshToken, profile);
      }
    )
  );

  server.get('/auth/pipedrive', passport.authenticate('pipedrive'));

  server.get(
    '**',
    express.static(browserDistFolder, {
      maxAge: '1y',
      index: 'index.html',
    })
  );

  server.get('**', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
