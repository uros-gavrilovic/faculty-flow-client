import { Component, OnInit, Signal } from '@angular/core';
import { PRIMENG_MODULES } from '../../../modules/ui.module';
import { User } from '../../../model/user.model';
import { Store } from '@ngrx/store';
import * as AppAction from '../../../store/app.action';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { COMMON_MODULES } from '../../../modules/common.module';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as AppSelector from '../../../store/app.selector';
import { PanelStepperComponent } from '../../misc/panel-stepper/panel-stepper.component';
import { UserFormComponent } from '../../user/user-form/user-form.component';
import { RoleFormComponent } from '../../user/role-form/role-form.component';
import { RegisterRequest } from '../../../model/auth.model';

export interface EmployeeSettingsModalData {
	uuid: string;
}

@Component({
	selector: 'app-employee-settings-modal',
	imports: [
		COMMON_MODULES,
		PRIMENG_MODULES,
		PanelStepperComponent,
		UserFormComponent,
		RoleFormComponent,
	],
	templateUrl: './employee-settings-modal.component.html',
	styleUrl: './employee-settings-modal.component.scss',
})
export class EmployeeSettingsModalComponent implements OnInit {

	user?: Signal<User | null>;

	form!: FormGroup;
	isEditMode: boolean;

	constructor(
		private store: Store,
		private formBuilder: FormBuilder,
		private ref: DynamicDialogRef,
		private config: DynamicDialogConfig,
	) {
		this.user = this.store.selectSignal(AppSelector.selectUser);
	}

	ngOnInit(): void {
		this.isEditMode = !!this.config.data?.uuid;
		this.initDispatch();
		this.initForm();
	}

	private initDispatch(): void {
		this.store.dispatch(AppAction.clearUser());
		if (this.isEditMode) this.store.dispatch(AppAction.getUser({ uuid: this.config.data.uuid }));
	}

	private initForm(): void {
		this.form = this.formBuilder.group({});
	}

	onSubmit(): void {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}

		const v = this.form.value;
		const user: User = {
			...(this.isEditMode ? this.user()! : {}),
			firstName: v.firstName,
			lastName: v.lastName,
			email: v.email,
			username: v.username,
			...(this.isEditMode ? {} : { password: v.password }),
			roles: v.roles,
		};

		if (this.isEditMode) {
			this.store.dispatch(AppAction.updateUser({ user }));
		} else {
			this.store.dispatch(AppAction.registerUser({ request: user as unknown as RegisterRequest }),);
		}

		this.onCancel();
	}

	onCancel(): void {
		this.store.dispatch(AppAction.clearUser());
		this.ref.close();
	}
}
