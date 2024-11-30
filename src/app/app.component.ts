import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { PipeDriveService } from './services/pipedrive/pipedrive.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ProgressSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  enableApp = false;

  constructor(
    private pipeDriveService: PipeDriveService,
    private router: Router
  ) {
    const result = this.router.parseUrl(this.router.url);
    console.log(result);
    const iframeID = result.queryParamMap.get('id');

    this.pipeDriveService.initialize(iframeID).then(() => {
      this.enableApp = true;
    });

    if (!iframeID) {
      console.error('No identifier found');
    }
  }
}
