import { Component, Signal } from '@angular/core';
import { PRIMENG_MODULES } from '../../modules/ui.module';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.store';
import { User } from '../../model/user.model';
import * as AppSelector from '../../store/app.selector';
import * as AppAction from '../../store/app.action';

interface NavItem {
	label: string;
	route: string;
	icon: string;
}

@Component({
	selector: 'app-menu',
	imports: [...PRIMENG_MODULES],
	templateUrl: './menu.component.html',
	styleUrl: './menu.component.scss',
})
export class MenuComponent {
	navItems: NavItem[] = [
		{ label: 'Schedule', route: '/schedule', icon: 'pi-calendar' },
		{ label: 'Reservations', route: '/reservations', icon: 'pi-bookmark' },
		{ label: 'Employees', route: '/employees', icon: 'pi-users' },
	];

	loggedUser: Signal<User>;

	get activeRoute(): string {
		return this.router.url;
	}

	constructor(
		private router: Router,
		private store: Store<AppState>,
	) {
		this.initSelectors();
	}

	navigate(route: string): void {
		this.router.navigate([route]);
	}

	navigateTo(route: string): void {
		this.router.navigate([route]);
	}

	onLogout(): void {
		this.store.dispatch(AppAction.logoutUser());
	}

	private initSelectors(): void {
		this.loggedUser = this.store.selectSignal(AppSelector.selectCurrentUser);
	}
}