import { Component } from '@angular/core';
import { PipeDriveService } from '../../services/pipedrive/pipedrive.service';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-finished',
  standalone: true,
  templateUrl: './finished.component.html',
  imports: [ButtonModule],
})
export class FinishedComponent {
  viewId: number | null = null;

  constructor(
    private router: Router,
    private pipeDriveService: PipeDriveService
  ) {}

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();

    if (navigation?.extras.state) {
      this.viewId = navigation.extras.state['id'];
    }
  }
  onViewDeal() {
    if (this.viewId) {
      this.pipeDriveService.closeView(this.viewId);
    }
  }
}
