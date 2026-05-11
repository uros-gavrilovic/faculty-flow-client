import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject, Signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { Token } from '../model/token.model';
import { selectToken } from '../store/app.selector';
import { PageUrl } from '../constant/page-url.constant';

const isTokenValid = (): boolean => {
	const store: Store = inject(Store);
	const tokenModel: Signal<Token | null> = store.selectSignal(selectToken);

	const token: string = tokenModel()?.token;
	const expiration: Date = tokenModel()?.expiration;

	return !!(token && expiration && new Date(expiration) > new Date());
};

export const authRedirectGuard: CanActivateFn = (): UrlTree => {
	const router: Router = inject(Router);
	return router.createUrlTree([isTokenValid() ? PageUrl.SCHEDULE : PageUrl.LOGIN]);
};

export const loginGuard: CanActivateFn = (): boolean | UrlTree => {
	const router: Router = inject(Router);
	return isTokenValid() ? router.createUrlTree([PageUrl.SCHEDULE]) : true;
};

export const authGuard: CanActivateFn = (): boolean | UrlTree => {
	const router: Router = inject(Router);
	return isTokenValid() || router.createUrlTree([PageUrl.LOGIN]);
};