import { Routes } from '@angular/router';
import { LoginPageComponent } from './page/login-page/login-page.component';
import { authenticationGuard, authRedirectGuard, loginGuard } from './guard/authentication.guard';
import { MainPageComponent } from './page/main-page/main-page.component';
import { SchedulePageComponent } from './page/schedule-page/schedule-page.component';
import { ReservationsPageComponent } from './page/reservations-page/reservations-page.component';
import { EmployeesPageComponent } from './page/employees-page/employees-page.component';
import { NotFoundPageComponent } from './page/not-found-page/not-found-page.component';
import { UserTableComponent } from './component/user/user-table/user-table.component';
import { roleGuard } from './guard/authorization.guard';
import { UserRole } from './model/user.model';
import { RoomsPageComponent } from './page/rooms-page/rooms-page.component';

export const routes: Routes = [
	{ path: '', canActivate: [authRedirectGuard], pathMatch: 'full', component: LoginPageComponent },
	{ path: 'login', canActivate: [loginGuard], component: LoginPageComponent },
	{
		path: '',
		canActivate: [authenticationGuard],
		component: MainPageComponent,
		children: [
			{ path: 'schedule', component: SchedulePageComponent },
			{
				path: 'reservations',
				component: ReservationsPageComponent,
				children: [
					{ path: '', component: UserTableComponent },
					{ path: ':uuid', component: UserTableComponent },
				],
			},
			{
				path: 'rooms',
				component: RoomsPageComponent,
				canActivate: [roleGuard([UserRole.ADMINISTRATOR])],
				children: [
					{ path: '', component: UserTableComponent },
					{ path: ':uuid', component: UserTableComponent },
				],
			},
			{
				path: 'employees',
				component: EmployeesPageComponent,
				canActivate: [roleGuard([UserRole.ADMINISTRATOR])],
				children: [
					{ path: '', component: UserTableComponent },
					{ path: ':uuid', component: UserTableComponent },
				],
			},
		],
	},
	{ path: '**', component: NotFoundPageComponent },
];