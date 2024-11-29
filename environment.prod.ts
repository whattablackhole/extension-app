import * as dotenv from 'dotenv';

dotenv.config();

export const environment = {
  production: true,
  clientID: process.env['CLIENT_ID'] || '',
  clientSecret: process.env['CLIENT_SECRET'] || '',
  callbackURL: process.env['CALLBACK_URL'] || '',
};
