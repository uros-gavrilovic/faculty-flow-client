import { Component } from '@angular/core';
import { BackgroundComponent } from '../../component/background/background.component';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.store';
import * as AppActions from '../../store/app.action';
import { LoginRequest } from '../../model/request/request.model';
import { PRIMENG_MODULES } from '../../modules/ui.module';
import { COMMON_MODULES } from '../../modules/forms.module';
import {
	FormBuilder,
	FormControl,
	FormGroup,
	Validators,
} from '@angular/forms';

@Component({
	selector: 'app-login-page',
	imports: [BackgroundComponent, ...PRIMENG_MODULES, ...COMMON_MODULES],
	templateUrl: './login-page.component.html',
	styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
	form: FormGroup;

	constructor(
		private store$: Store<AppState>,
		private formBuilder: FormBuilder,
	) {}

	ngOnInit(): void {
		this.initForm();
	}

	private initForm(): void {
		this.form = this.formBuilder.group({
			username: ['admin', [Validators.required]],
			password: ['admin123', Validators.required],
		});
	}

	onLogin(): void {
		const request: LoginRequest = this.form.getRawValue();
		this.store$.dispatch(AppActions.loginUser({ request }));
	}

	get username(): FormControl {
		return this.form.get('username') as FormControl;
	}
	get password(): FormControl {
		return this.form.get('password') as FormControl;
	}
}
