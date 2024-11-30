import { Injectable } from '@angular/core';
import AppExtensionsSDK, { Command, View } from '@pipedrive/app-extensions-sdk';

@Injectable({
  providedIn: 'root',
})
export class PipeDriveService {

  sdk: AppExtensionsSDK | null = null;

  async initialize() {
    this.sdk = await new AppExtensionsSDK().initialize({
      size: { height: 600, width: 800 },
    });
  }

  async closeView(redirectId: number) {
    await this.sdk!.execute(Command.REDIRECT_TO, { view: View.DEALS, id: redirectId });
    await this.sdk!.execute(Command.CLOSE_MODAL);
  }
}
