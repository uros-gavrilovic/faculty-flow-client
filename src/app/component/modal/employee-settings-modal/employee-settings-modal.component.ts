import { Component, computed, effect, input, OnInit, output, Signal, signal } from '@angular/core';
import { PRIMENG_MODULES } from '../../../modules/ui.module';
import { User, UserRole } from '../../../model/user.model';
import { Store } from '@ngrx/store';
import * as AppAction from '../../../store/app.action';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { COMMON_MODULES } from '../../../modules/common.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as AppSelector from '../../../store/app.selector';
import { Severity } from '../../../model/ui.model';
import {roleTagSeverityMap} from '../../../constant/severity.constant';
import { RegisterRequest } from '../../../model/auth.model';

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
	user?: Signal<User | null>;

	form!: FormGroup;
	isEditMode: boolean;

	readonly allRoles: UserRole[] = Object.values(UserRole);

	constructor(
		private store: Store,
		private fb: FormBuilder,
		private ref: DynamicDialogRef,
		private config: DynamicDialogConfig,
	) {
		this.user = this.store.selectSignal(AppSelector.selectUser);
		effect(() => {
			if (this.user()) this.patchForm(this.user());
		});
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
		this.form = this.fb.group({
			firstName: [null, Validators.required],
			lastName: [null, Validators.required],
			email: [null, [Validators.required, Validators.email]],
			username: [null, Validators.required],
			roles: this.fb.group(Object.fromEntries(this.allRoles.map((role) => [role, [false]]))),
		});

		if (!this.isEditMode) {
			this.form.addControl('password', this.fb.control(null, Validators.required));
		}
	}

	private patchForm(user: User): void {
		this.form.patchValue({
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			username: user.username,
			roles: Object.fromEntries(this.allRoles.map((role) => [role, user.roles.includes(role)])),
		});
	}

	onSubmit(): void {
		if (this.form.invalid) return;

		const v = this.form.value;
		const user: User = {
			...(this.isEditMode ? this.user()! : {}),
			firstName: v.firstName,
			lastName: v.lastName,
			email: v.email,
			username: v.username,
			...(this.isEditMode ? {} : { password: v.password }),
			roles: this.allRoles.filter((role) => v.roles[role]),
		};

		if (this.isEditMode) {
			this.store.dispatch(AppAction.updateUser({ user }));
		} else {
			// this.store.dispatch(AppAction.registerUser({ request: user as RegisterRequest }));
		}

		this.onCancel();
	}

	onCancel(): void {
		this.ref.close();
	}

	getRoleSeverity(role: UserRole): Severity {
		return roleTagSeverityMap[role];
	}
}
