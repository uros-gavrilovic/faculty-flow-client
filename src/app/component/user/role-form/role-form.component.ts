import { Component, effect, Input, OnInit, Signal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { User, UserRole } from '../../../model/user.model';
import { Severity } from '../../../model/ui.model';
import { roleTagSeverityMap } from '../../../constant/severity.constant';
import { PRIMENG_MODULES } from '../../../modules/ui.module';
import { COMMON_MODULES } from '../../../modules/common.module';

@Component({
	selector: 'app-role-form',
	imports: [COMMON_MODULES, PRIMENG_MODULES],
	templateUrl: './role-form.component.html',
	styleUrl: './role-form.component.scss',
})
export class RoleFormComponent implements OnInit {
	@Input() user!: Signal<User>;
	@Input() form: FormGroup;

	readonly allRoles: UserRole[] = Object.values(UserRole);

	constructor(private formBuilder: FormBuilder) {
		effect(() => {
			if (this.user()) this.patchForm(this.user());
		});
	}

	ngOnInit(): void {
		this.initForm();
	}

	private initForm(): void {
		this.form.addControl('roles', this.formBuilder.control<UserRole[]>([]));
	}

	private patchForm(user: User): void {
		this.form.patchValue({ roles: user.roles });
	}

	onRemoveRole(role: UserRole): void {
		const roles = this.form.controls['roles'].value as UserRole[];
		this.form.controls['roles'].setValue(roles.filter((r) => r !== role));
	}

	getRoleSeverity(role: UserRole): Severity {
		return roleTagSeverityMap[role];
	}
}
