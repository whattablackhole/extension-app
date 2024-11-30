import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
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

  constructor(private pipeDriveService: PipeDriveService, private route: ActivatedRoute) {
    this.route.queryParams.subscribe((params) => {
      this.pipeDriveService.initialize(params['id']).then(() => {
        this.enableApp = true;
      });
    });
  }
}
