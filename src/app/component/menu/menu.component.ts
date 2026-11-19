import { Component, computed, Signal } from '@angular/core';
import { PRIMENG_MODULES } from '../../modules/ui.module';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.store';
import { User, UserRole } from '../../model/user.model';
import * as AppSelector from '../../store/app.selector';
import * as AppAction from '../../store/app.action';
import { COMMON_MODULES } from '../../modules/common.module';
import { Language, SUPPORTED_LANGUAGES } from '../../constant/language.constant';

interface NavItem {
	label: string;
	route: string;
	icon: string;
	allowedRoles?: UserRole[],
}

@Component({
	selector: 'app-menu',
	imports: [...PRIMENG_MODULES, ...COMMON_MODULES, RouterLink, RouterLinkActive],
	templateUrl: './menu.component.html',
	styleUrl: './menu.component.scss',
})
export class MenuComponent {
	navItems: NavItem[] = [
		{ label: 'menu.schedule', route: '/schedule', icon: 'pi-calendar' },
		{ label: 'menu.reservations', route: '/reservations', icon: 'pi-address-book' },
		{
			label: 'menu.rooms',
			route: '/rooms',
			icon: 'pi-building',
			allowedRoles: [UserRole.ADMINISTRATOR],
		},
		{
			label: 'menu.employees',
			route: '/employees',
			icon: 'pi-users',
			allowedRoles: [UserRole.ADMINISTRATOR],
		},
	];

	currentUser: Signal<User>;
	currentLang: Signal<Language>;

	readonly visibleNavItems: Signal<NavItem[]> = computed(() => {
		const userRoles: UserRole[] = this.currentUser()?.roles ?? [];
		return this.navItems.filter(
			(item) => !item.allowedRoles || item.allowedRoles.some((role) => userRoles.includes(role)),
		);
	});
	readonly currentUserInitials: Signal<string> = computed(() => {
		return this.currentUser() ?
			`${this.currentUser()?.firstName[0]}${this.currentUser()?.lastName[0]}` :
			'';
	});

	constructor(
		private store: Store<AppState>,
	) {
		this.initSelectors();
	}

	private initSelectors(): void {
		this.currentUser = this.store.selectSignal(AppSelector.selectCurrentUser);
		this.currentLang = this.store.selectSignal(AppSelector.selectLanguage);
	}

	onToggleLanguage(): void {
		const index: number = SUPPORTED_LANGUAGES.indexOf(this.currentLang());
		const language: Language = SUPPORTED_LANGUAGES[(index + 1) % SUPPORTED_LANGUAGES.length];
		this.store.dispatch(AppAction.setLanguage({ language }));
	}

	onLogout(): void {
		this.store.dispatch(AppAction.logoutUser());
	}
}