import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { PipeDriveService } from './services/pipedrive/pipedrive.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',

})
export class AppComponent {
  constructor(private route: ActivatedRoute, private pipeDriveService: PipeDriveService) { }

  async ngOnInit() {
    this.pipeDriveService.initialize();
  }
}
