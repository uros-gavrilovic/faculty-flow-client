import { Component } from '@angular/core';
import { MenuComponent } from '../../component/menu/menu.component';
import { RouterOutlet } from '@angular/router';

@Component({
	selector: 'app-main-page',
	imports: [MenuComponent, RouterOutlet],
	templateUrl: './main-page.component.html',
	styleUrl: './main-page.component.scss',
})
export class MainPageComponent {}
