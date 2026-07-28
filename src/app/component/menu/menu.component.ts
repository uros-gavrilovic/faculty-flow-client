import { Component, computed, Signal } from '@angular/core';
import { PRIMENG_MODULES } from '../../modules/ui.module';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.store';
import { User, UserRole } from '../../model/user.model';
import * as AppSelector from '../../store/app.selector';
import * as AppAction from '../../store/app.action';

interface NavItem {
	label: string;
	route: string;
	icon: string;
	allowedRoles?: UserRole[],
}

@Component({
	selector: 'app-menu',
	imports: [...PRIMENG_MODULES, RouterLink, RouterLinkActive],
	templateUrl: './menu.component.html',
	styleUrl: './menu.component.scss',
})
export class MenuComponent {
	navItems: NavItem[] = [
		{ label: 'Schedule', route: '/schedule', icon: 'pi-calendar' },
		{ label: 'Reservations', route: '/reservations', icon: 'pi-address-book' },
		{
			label: 'Rooms',
			route: '/rooms',
			icon: 'pi-building',
			allowedRoles: [UserRole.ADMINISTRATOR],
		},
		{
			label: 'Employees',
			route: '/employees',
			icon: 'pi-users',
			allowedRoles: [UserRole.ADMINISTRATOR],
		},
	];

	currentUser: Signal<User>;

	readonly visibleNavItems: Signal<NavItem[]> = computed(() => {
		const userRoles: UserRole[] = this.currentUser()?.roles ?? [];
		return this.navItems.filter(
			(item) => !item.allowedRoles || item.allowedRoles.some((role) => userRoles.includes(role)),
		);
	});
	readonly currentUserInitials: Signal<string> = computed(() => {
		return this.currentUser()
			? `${this.currentUser()?.firstName[0]}${this.currentUser()?.lastName[0]}`
			: '';
	});

	constructor(
		private router: Router,
		private store: Store<AppState>,
	) {
		this.initSelectors();
	}

	private initSelectors(): void {
		this.currentUser = this.store.selectSignal(AppSelector.selectCurrentUser);
	}

	onLogout(): void {
		this.store.dispatch(AppAction.logoutUser());
	}
}