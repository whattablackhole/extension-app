import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  providers: [],
  imports: [],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  ngOnInit() {
    this.initiateOAuthFlow();
  }

  initiateOAuthFlow() {
    window.location.href = 'http://localhost:4200/auth/pipedrive';
  }
}
