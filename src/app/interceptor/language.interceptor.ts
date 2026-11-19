import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectLanguage } from '../store/app.selector';
import { Language } from '../constant/language.constant';

export const languageInterceptor: HttpInterceptorFn = (
	request: HttpRequest<unknown>,
	next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
	const language: Language = inject(Store).selectSignal(selectLanguage)();

	return next(request.clone({ setHeaders: { 'Accept-Language': language } }));
};
