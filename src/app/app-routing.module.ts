import { InjectionToken, NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

const externalUrlProvider = new InjectionToken('externalUrlRedirectResolver');

const routes: Routes = [
  { path: 'landing', loadChildren: () => import('./landing/landing.module').then((m) => m.LandingModule) },
  { path: 'users', loadChildren: () => import('./users/users.module').then((m) => m.UsersModule) },
  { path: 'misc', loadChildren: () => import('./misc/misc.module').then((m) => m.MiscModule) },
  { path: 'externalRedirect', canActivate: [externalUrlProvider], component: AppComponent },
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [{
    provide: externalUrlProvider,
    useValue: (route: ActivatedRouteSnapshot) => {
      const externalUrl = route.paramMap.get('externalUrl') as string;
      const newWindow = route.paramMap.get('newWindow') as string;
      newWindow === 'true' ? window.open(externalUrl) : window.location.replace(externalUrl);
    }
  }]
})
export class AppRoutingModule { }
