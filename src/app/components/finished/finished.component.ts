import { Component } from '@angular/core';
import { PipeDriveService } from '../../services/pipedrive/pipedrive.service';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';

@Component({
  selector: 'app-finished',
  standalone: true,
  templateUrl: './finished.component.html',
  imports: [ButtonModule],
})
export class FinishedComponent {
  viewId: number | null = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private pipeDriveService: PipeDriveService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.pipe(take(1)).subscribe((params) => {
      this.viewId = Number.parseInt(params.get('id')!);
    });
  }

  onViewDeal() {
    if (this.viewId) {
      this.pipeDriveService.closeView(this.viewId);
    }
  }
}
