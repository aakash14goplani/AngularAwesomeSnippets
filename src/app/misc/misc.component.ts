/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-restricted-globals */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-misc',
  templateUrl: './misc.component.html',
  styleUrls: ['./misc.component.scss']
})
export class MiscComponent implements OnInit, OnDestroy {
  showError = false;
  private unsubscriber = new Subject<void>();

  constructor() { }

  ngOnInit(): void {
    console.group();
    console.log('Misc component created');
    history.pushState(null, null as any, null);

    fromEvent(window, 'popstate').pipe(
      takeUntil(this.unsubscriber)
    ).subscribe((_) => {
      history.pushState(null, null as any, location.href);
      this.showError = true;
    });
  }

  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
    console.log('Misc component destroyed');
    console.groupEnd();
  }
}
