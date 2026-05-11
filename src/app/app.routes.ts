import { Routes } from '@angular/router';
import { LoginPageComponent } from './page/login-page/login-page.component';
import { authGuard, authRedirectGuard, loginGuard } from './guard/auth.guard';
import { MainPageComponent } from './page/main-page/main-page.component';
import { SchedulePageComponent } from './page/schedule-page/schedule-page.component';
import { ReservationsPageComponent } from './page/reservations-page/reservations-page.component';
import { EmployeesPageComponent } from './page/employees-page/employees-page.component';
import { NotFoundPageComponent } from './page/not-found-page/not-found-page.component';

export const routes: Routes = [
	{ path: '', canActivate: [authRedirectGuard], pathMatch: 'full', component: LoginPageComponent },
	{ path: 'login', canActivate: [loginGuard], component: LoginPageComponent },
	{
		path: '',
		canActivate: [authGuard],
		component: MainPageComponent,
		children: [
			{ path: 'schedule', component: SchedulePageComponent },
			{ path: 'reservations', component: ReservationsPageComponent },
			{ path: 'employees', component: EmployeesPageComponent },
		],
	},
	{ path: '**', component: NotFoundPageComponent },
];