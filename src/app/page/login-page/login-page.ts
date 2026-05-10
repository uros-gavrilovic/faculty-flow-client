import { Component } from '@angular/core';
import { BackgroundComponent } from '../../component/background/background.component';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.store';
import * as AppActions from '../../store/app.action';
import { LoginRequest } from '../../model/request/request.model';
import { PRIMENG_MODULES } from '../../modules/ui.module';
import { COMMON_MODULES } from '../../modules/forms.module';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
	selector: 'app-login-page',
	imports: [BackgroundComponent, ...PRIMENG_MODULES, ...COMMON_MODULES, TranslatePipe],
	templateUrl: './login-page.html',
	styleUrl: './login-page.scss',
})
export class LoginPage {
	constructor(private store$: Store<AppState>) {}

	value3: string | undefined;

	onLogin(): void {
		const request: LoginRequest = {
			username: 'admin',
			password: 'admin123',
		};
		this.store$.dispatch(AppActions.loginUser({ request }));
	}
}
