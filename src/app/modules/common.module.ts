import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { RequiredPipe } from '../pipe/required-pipe';
import { DatePipe } from '@angular/common';

export const COMMON_MODULES = [
	TranslatePipe,
	RequiredPipe,
	FormsModule,
	ReactiveFormsModule,
	DatePipe,
];
