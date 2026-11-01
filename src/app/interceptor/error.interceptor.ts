import { inject, Injector } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { MessageService } from '../service/message.service';
import { MessageSeverity } from '../model/message-severity.model';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

	const injector: Injector = inject(Injector);
	return next(req).pipe(
		catchError((error: HttpErrorResponse) => {
			const messageService = injector.get(MessageService);

			messageService.showMessage(
				MessageSeverity.ERROR,
				'messages.error.generic',
				error?.error?.message ?? error.message,
			);

			return throwError(() => error);
		}),
	);
};
