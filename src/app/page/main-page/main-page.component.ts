import { Component } from '@angular/core';
import { MenuComponent } from '../../component/menu/menu.component';

@Component({
	selector: 'app-main-page',
	imports: [MenuComponent],
	templateUrl: './main-page.component.html',
	styleUrl: './main-page.component.scss',
})
export class MainPageComponent {}
