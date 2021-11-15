import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import * as supportedBrowsers from '../supportedBrowsers';
import { detect } from 'detect-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  browserSupported = '';
  title = 'Browser Support';
  message = '';

  ngOnInit(): void {
    this.browserSupported = supportedBrowsers.test(navigator.userAgent) ? '' : 'not';
    this.message = `Your current browser ${detect()?.name} version ${detect()?.version} is ${this.browserSupported} supported`;
  }
}
