import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PipeDriveService } from './services/pipedrive/pipedrive.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  enableApp = true;

  constructor(private pipeDriveService: PipeDriveService) {}

  ngOnInit() {
    this.pipeDriveService.initialize().catch(()=>{
      this.enableApp = false;
    });
  }
}
