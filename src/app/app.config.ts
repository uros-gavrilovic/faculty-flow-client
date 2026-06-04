import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { appReducer } from './store/app.reducer';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideEffects } from '@ngrx/effects';
import * as AppEffects from './store/app.effect';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptor/auth.interceptor';
import { APP_STATE_KEY } from './store/app.store';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { provideTranslateService, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		provideRouter(routes),
		provideStore({ [APP_STATE_KEY]: appReducer }),
		provideEffects(AppEffects),
		provideStoreDevtools({ maxAge: 25, logOnly: true }),
		provideHttpClient(withInterceptors([authInterceptor])),
		provideTranslateService({
			fallbackLang: 'en',
			lang: 'en',
			loader: provideTranslateHttpLoader({
				prefix: './i18n/',
				suffix: '.json',
			}),
		}),
		providePrimeNG({
			theme: {
				preset: Aura,
				options: {
					darkModeSelector: false,
				},
			},
		}),
		MessageService,
		DialogService,
		ConfirmationService,
	],
};
