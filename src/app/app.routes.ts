import { Routes } from '@angular/router';
import { LoginPageComponent } from './page/login-page/login-page.component';
import { authGuard, authRedirectGuard, loginGuard } from './guard/auth.guard';
import { MainPageComponent } from './page/main-page/main-page.component';

export const routes: Routes = [
	{ path: '', canActivate: [authRedirectGuard], pathMatch: 'full', component: LoginPageComponent },
	{ path: 'login', canActivate: [loginGuard], component: LoginPageComponent },
	{ path: 'app', canActivate: [authGuard], component: MainPageComponent },
];