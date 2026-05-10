import {
	HttpErrorResponse,
	HttpEvent,
	HttpHandlerFn,
	HttpInterceptorFn,
	HttpRequest,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Token } from '../model/token.model';
import { Store } from '@ngrx/store';
import { inject, Signal } from '@angular/core';
import { selectToken } from '../store/app.selector';

export const authInterceptor: HttpInterceptorFn = (
	request: HttpRequest<unknown>,
	next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
	const store: Store = inject(Store);
	const tokenModel: Signal<Token | null> = store.selectSignal(selectToken);

	const token: string = tokenModel()?.token;
	const expiration: Date = tokenModel()?.expiration;
	const isValid: boolean = expiration && new Date(expiration) > new Date();

	const modifiedRequest = (token && isValid) ?
		request.clone({
			setHeaders: {
				Authorization: `Bearer ${token}`,
			},
		}) :
		request;

	return next(modifiedRequest).pipe(
		catchError((error: HttpErrorResponse) => {
			if (error.status === 401) {
				console.error(error); // TODO
			}

			return throwError(() => error);
		}),
	);
};