import { Component } from '@angular/core';
import { BackgroundComponent } from '../../component/background/background.component';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.store';
import * as AppActions from '../../store/app.action';
import { LoginRequest } from '../../model/request/auth.model';

@Component({
	selector: 'app-login-page',
	imports: [BackgroundComponent],
	templateUrl: './login-page.html',
	styleUrl: './login-page.scss',
})
export class LoginPage {

	constructor(
		private store$: Store<AppState>,
	) {}

	onLogin(): void {
		const request: LoginRequest = {
			username: 'admin',
			password: 'admin123',
		}
		this.store$.dispatch(AppActions.loginUser({request}));
	}
}
