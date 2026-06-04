import { Component, computed, effect, input, OnInit, output, Signal, signal } from '@angular/core';
import { PRIMENG_MODULES } from '../../../modules/ui.module';
import { User, UserRole } from '../../../model/user.model';
import { Store } from '@ngrx/store';
import * as AppAction from '../../../store/app.action';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { RequestDialogData } from '../request-reservation-modal/request-reservation-modal.component';
import { COMMON_MODULES } from '../../../modules/common.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as AppSelector from '../../../store/app.selector';

export interface EmployeeSettingsModalData {
	uuid: string;
}

@Component({
	selector: 'app-employee-settings-modal',
	imports: [COMMON_MODULES, PRIMENG_MODULES],
	templateUrl: './employee-settings-modal.component.html',
	styleUrl: './employee-settings-modal.component.scss',
})
export class EmployeeSettingsModalComponent implements OnInit {

	user: Signal<User | null>

	constructor(
		private store: Store,
		private fb: FormBuilder,
		private ref: DynamicDialogRef,
		private config: DynamicDialogConfig
	) {
		effect((): void => {
			if (this.user() !== null) this.patchForm(this.user());
		});
	}

	private patchForm(user: User): void {
		this.form.patchValue({
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			username: user.username,
			roles: Object.fromEntries(
				this.allRoles.map((role) => [role, user.roles.includes(role)]),
			),
		});
	}

	readonly allRoles = Object.values(UserRole);
	form!: FormGroup;

	ngOnInit(): void {
		this.initForm();
		this.store.dispatch(AppAction.getUser({ uuid: this.config.data.uuid }));
		this.user = this.store.selectSignal(AppSelector.selectUser);
		console.log(this.user());
	}

	private initForm(): void {
		this.form = this.fb.group({
			firstName: [null, Validators.required],
			lastName: [null, Validators.required],
			email: [null, [Validators.required, Validators.email]],
			username: [null, Validators.required],
			roles: this.fb.group(
				// Object.fromEntries(this.allRoles.map((role) => [role, [u.roles.includes(role)]])),
				Object.fromEntries(this.allRoles.map((role) => [role, [false]])),
			),
		});
	}

	getRoleSeverity(role: UserRole): 'danger' | 'secondary' {
		return role === UserRole.ADMINISTRATOR ? 'danger' : 'secondary';
	}

	onSubmit(): void {
		if (this.form.invalid) return;
		const v = this.form.value;
		const updated: User = {
			...this.user(),
			firstName: v.firstName,
			lastName: v.lastName,
			email: v.email,
			username: v.username,
			roles: this.allRoles.filter((role) => v.roles[role]),
		};


		this.store.dispatch(AppAction.updateUser({ user: updated }));
		this.onCancel();
	}

	onCancel(): void {
		this.ref.close();
	}
}
