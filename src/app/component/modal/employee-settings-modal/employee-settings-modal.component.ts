import { Component, computed, DestroyRef, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PRIMENG_MODULES } from '../../../modules/ui.module';
import { COMMON_MODULES } from '../../../modules/common.module';
import { User, UserRole } from '../../../model/user.model';
import { RegisterRequest } from '../../../model/auth.model';
import * as AppAction from '../../../store/app.action';
import * as AppSelector from '../../../store/app.selector';
import { getAvatarSeverity } from '../../../constant/severity.constant';
import { UserFormComponent } from '../../user/user-form/user-form.component';
import { RoleFormComponent } from '../../user/role-form/role-form.component';

export interface EmployeeSettingsModalData {
	uuid: string;
}

interface EmployeeFormValue {
	firstName?: string | null;
	lastName?: string | null;
	email?: string | null;
	username?: string | null;
	password?: string | null;
	roles?: UserRole[] | null;
}

@Component({
	selector: 'app-employee-settings-modal',
	imports: [COMMON_MODULES, PRIMENG_MODULES, UserFormComponent, RoleFormComponent],
	templateUrl: './employee-settings-modal.component.html',
	styleUrl: './employee-settings-modal.component.scss',
})
export class EmployeeSettingsModalComponent implements OnInit {
	readonly user: Signal<User | null>;
	readonly form: FormGroup;
	isEditMode: boolean;

	readonly submitting: WritableSignal<boolean> = signal(false);

	private readonly formValue: Signal<EmployeeFormValue>;

	readonly fullName: Signal<string> = computed(() => {
		const { firstName, lastName } = this.formValue();
		return [firstName, lastName].filter(Boolean).join(' ').trim();
	});
	readonly initials: Signal<string> = computed(() => {
		const { firstName, lastName } = this.formValue();
		return `${firstName?.trim()?.[0] ?? ''}${lastName?.trim()?.[0] ?? ''}`.toUpperCase();
	});
	readonly username: Signal<string> = computed(() => this.formValue().username?.trim() ?? '');
	readonly email: Signal<string> = computed(() => this.formValue().email?.trim() ?? '');
	readonly avatarSeverity: Signal<string> = computed(
		() => getAvatarSeverity({ roles: this.formValue().roles ?? [] } as User) ?? 'undefined',
	);

	constructor(
		private store: Store,
		private formBuilder: FormBuilder,
		private actions$: Actions,
		private ref: DynamicDialogRef,
		private config: DynamicDialogConfig<EmployeeSettingsModalData>,
		private destroyRef: DestroyRef,
	) {
		this.user = this.store.selectSignal(AppSelector.selectUser);
		this.form = this.formBuilder.group({});
		this.formValue = toSignal(this.form.valueChanges, { initialValue: {} });
	}

	ngOnInit(): void {
		this.isEditMode = !!this.config.data?.uuid;

		this.store.dispatch(AppAction.clearUser());
		if (this.isEditMode) this.store.dispatch(AppAction.getUser({ uuid: this.config.data.uuid }));
	}

	onSubmit(): void {
		if (this.submitting()) return;

		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}

		const v = this.form.getRawValue();
		const user: User = {
			...(this.isEditMode ? this.user()! : {}),
			firstName: v.firstName,
			lastName: v.lastName,
			email: v.email,
			username: v.username,
			...(this.isEditMode ? {} : { password: v.password }),
			roles: v.roles,
		};

		const successAction = this.isEditMode ? AppAction.updateUserSuccess : AppAction.registerUserSuccess;

		this.submitting.set(true);
		this.actions$
			.pipe(ofType(successAction, AppAction.userFailure), take(1), takeUntilDestroyed(this.destroyRef))
			.subscribe((action) => {
				this.submitting.set(false);
				if (action.type === successAction.type) this.onCancel();
			});

		if (this.isEditMode) {
			this.store.dispatch(AppAction.updateUser({ user }));
		} else {
			this.store.dispatch(AppAction.registerUser({ request: user as unknown as RegisterRequest }));
		}
	}

	onCancel(): void {
		this.store.dispatch(AppAction.clearUser());
		this.ref.close();
	}
}
