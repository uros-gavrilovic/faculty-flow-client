import { Component, effect, Input, OnInit, Signal } from '@angular/core';
import { Chip } from 'primeng/chip';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MultiSelect } from 'primeng/multiselect';
import { Tag } from 'primeng/tag';
import { TranslatePipe } from '@ngx-translate/core';
import { User, UserRole } from '../../../model/user.model';
import { Severity } from '../../../model/ui.model';
import { roleTagSeverityMap } from '../../../constant/severity.constant';

@Component({
	selector: 'app-role-form',
	imports: [Chip, FormsModule, MultiSelect, ReactiveFormsModule, Tag, TranslatePipe],
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

	onRemoveRole(role: UserRole): void {
		const roles = this.form.controls['roles'].value as UserRole[];
		this.form.controls['roles'].setValue(roles.filter((r) => r !== role));
	}

	getRoleSeverity(role: UserRole): Severity {
		return roleTagSeverityMap[role];
	}

	private initForm() {
		this.form.addControl('roles', this.formBuilder.control<UserRole[]>([]));
	}

	private patchForm(user: User): void {
		this.form.patchValue({
			roles: user.roles,
		});
	}
}
