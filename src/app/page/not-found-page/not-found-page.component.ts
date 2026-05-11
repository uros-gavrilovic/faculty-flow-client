import { Component } from '@angular/core';
import { BackgroundComponent } from '../../component/background/background.component';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { PrimeTemplate } from 'primeng/api';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
	selector: 'app-not-found-page',
	imports: [
		BackgroundComponent,
		Button,
		InputText,
		PrimeTemplate,
		ReactiveFormsModule,
		TranslatePipe,
	],
	templateUrl: './not-found-page.component.html',
	styleUrl: './not-found-page.component.scss',
})
export class NotFoundPageComponent {}
