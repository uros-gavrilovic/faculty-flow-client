import { Component, effect, Input, OnInit, Signal } from '@angular/core';
import { FloatLabel } from 'primeng/floatlabel';
import {
	FormBuilder,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { TranslatePipe } from '@ngx-translate/core';
import { User } from '../../../model/user.model';
import { NgClass } from '@angular/common';

@Component({
	selector: 'app-user-form',
	imports: [FloatLabel, FormsModule, InputText, ReactiveFormsModule, TranslatePipe, NgClass],
	templateUrl: './user-form.component.html',
	styleUrl: './user-form.component.scss',
})
export class UserFormComponent implements OnInit {

	@Input() user: Signal<User>;
	@Input() form: FormGroup;
	@Input() isEditMode: boolean;

	constructor(private formBuilder: FormBuilder) {
		effect(() => {
			if (this.user()) this.patchForm(this.user());
		});
	}

	ngOnInit(): void {
		this.initForm();
	}

	private initForm(): void {
		this.form.addControl('firstName', this.formBuilder.control(null, Validators.required));
		this.form.addControl('lastName', this.formBuilder.control(null, Validators.required));
		this.form.addControl('email', this.formBuilder.control(null, [Validators.required, Validators.email]),);
		this.form.addControl('username', this.formBuilder.control(null, Validators.required));

		if (!this.isEditMode) {
			this.form.addControl('password', this.formBuilder.control(null, Validators.required));
		}
	}

	private patchForm(user: User): void {
		this.form.patchValue({
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			username: user.username,
			roles: user.roles,
		});
	}
}
