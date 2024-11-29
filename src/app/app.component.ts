import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // this.route.queryParams.subscribe((params) => {
    //   console.log('URL Parameters:', params);
    // });
  }
}
