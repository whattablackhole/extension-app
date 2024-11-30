import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, take } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private readonly baseUrl = environment.pipeDriveBaseUrl;

  constructor(
    private httpService: HttpClient,
    private authService: AuthService
  ) {}

  getDealFields() {
    return this.httpService
      .get(`${this.baseUrl}/dealFields`, {
        headers: {
          Authorization: `Bearer ${this.authService.getAccessToken()}`,
        },
      })
      .pipe(
        take(1),
        map((r) => (r as any).data as any[])
      );
  }

  createDeal(data: any) {
    return this.httpService
      .post(`${this.baseUrl}/deals`, data, {
        headers: {
          Authorization: `Bearer ${this.authService.getAccessToken()}`,
        },
      })
      .pipe(take(1));
  }

  getStages(pipelineID: number) {
    return this.httpService
      .get(`${this.baseUrl}/stages?pipeline_id=${pipelineID}`, {
        headers: {
          Authorization: `Bearer ${this.authService.getAccessToken()}`,
        },
      })
      .pipe(
        take(1),
        map((r) => (r as any).data as any[])
      );
  }
}
