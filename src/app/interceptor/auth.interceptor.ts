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
import { MessageService } from '../service/message.service';
import { MessageSeverity } from '../model/message-severity.model';
import { Router } from '@angular/router';

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
			const messageService: MessageService = inject(MessageService);

			if (error.status === 401) {
				messageService.showMessage(
					MessageSeverity.WARN,
					'messages.auth.token-expired.title',
					'messages.auth.token-expired.message',
				);

				const router: Router = inject(Router);
				router.navigate(['/login']);
			} else if (error.status === 403) {
				messageService.showMessage(
					MessageSeverity.WARN,
					'messages.auth.insufficient-privileges.title',
					'messages.auth.insufficient-privileges.message',
				);
			}

			return throwError(() => error);
		}),
	);
};