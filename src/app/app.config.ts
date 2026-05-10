import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
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

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		provideRouter(routes),
		provideStore({ [APP_STATE_KEY]: appReducer }),
		provideEffects(AppEffects),
		provideStoreDevtools({ maxAge: 25, logOnly: true }),
		provideHttpClient(withInterceptors([authInterceptor])),
	],
};
