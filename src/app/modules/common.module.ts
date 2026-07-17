import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { RequiredPipe } from '../pipe/required-pipe';
import { DatePipe } from '@angular/common';
import { NgClass } from '@angular/common';
import { TranslateEnumPipe } from '../pipe/translate-enum-pipe';

export const COMMON_MODULES = [
	TranslatePipe,
	RequiredPipe,
	FormsModule,
	ReactiveFormsModule,
	DatePipe,
	NgClass,
	TranslateEnumPipe,
];
