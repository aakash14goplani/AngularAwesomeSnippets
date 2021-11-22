import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = '';
  currentRoute = '';

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.title = `Angular Routing Stuff v${environment.APP_VERSION}`;
    (window as any).APP_VERSION = environment.APP_VERSION;
  }

  onNavigationClick(path: string): void {
    this.router.navigate([path]);
  }

  onExternalNavigationClick(externalUrl: string, newWindow: string): void {
    this.router.navigate(['externalRedirect', { externalUrl, newWindow }]);
  }
}
