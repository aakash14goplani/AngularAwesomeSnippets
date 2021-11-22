import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {
  constructor() { }

  ngOnInit() {
    console.group();
    console.log('users component created');
  }

  ngOnDestroy() {
    console.log('users component destroyed');
    console.groupEnd();
  }
}
