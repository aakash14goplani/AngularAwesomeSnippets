import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit, OnDestroy {
  constructor() { }

  ngOnInit() {
    console.group();
    console.log('landing component created');
  }

  ngOnDestroy() {
    console.log('Landing component destroyed');
    console.groupEnd();
  }
}
