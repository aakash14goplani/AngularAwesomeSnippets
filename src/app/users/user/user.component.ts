import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {
  url = '';
  private unsubscribe = new Subject<void>();

  constructor(private router: Router) { }

  ngOnInit(): void {
    console.log('user component created');
    this.url = this.formatUrl(window.location.href);

    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      tap((event) => {
        this.url = this.formatUrl((event as NavigationEnd).url);
      }),
      takeUntil(this.unsubscribe)
    ).subscribe();
  }

  private formatUrl(url: string): string {
    return url.substring(url.lastIndexOf('/') + 1) || 'user';
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    console.log('user component destroyed');
  }
}
