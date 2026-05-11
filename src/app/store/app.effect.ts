import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { UserApiService } from '../service/user-api.service';
import * as AppAction from './app.action';
import { catchError, switchMap, map, tap } from 'rxjs';
import { LoginResponse } from '../model/response/response.model';
import { Router } from '@angular/router';
import { MessageService } from '../service/message.service';
import { MessageSeverity } from '../model/message-severity.model';
import { PageUrl } from '../constant/page-url.constant';

export const loginEffect = createEffect(
	() => {
		const actions$ = inject(Actions);
		const userApi = inject(UserApiService);

		return actions$.pipe(
			ofType(AppAction.loginUser),
			switchMap(({ request }) =>
				userApi
					.login(request)
					.pipe(
						switchMap((loginResponse: LoginResponse) => [
							AppAction.loginUserSuccess({ loginResponse }),
							AppAction.getUser({ username: request.username }),
						]),
					),
			),
		);
	},
	{ functional: true },
);

export const loginRedirectEffect = createEffect(
	() => {
		const actions$: Actions = inject(Actions);
		const router: Router = inject(Router);
		const messageService = inject(MessageService);

		return actions$.pipe(
			ofType(AppAction.loginUserSuccess),
			tap(() => {
				messageService.showMessage(
					MessageSeverity.INFO,
					'messages.auth.login.title',
					'messages.auth.login.message',
				);
				router.navigate([PageUrl.SCHEDULE]);
			}),
		);
	},
	{ functional: true, dispatch: false },
);

export const logoutRedirectEffect = createEffect(
	() => {
		const actions$ = inject(Actions);
		const router = inject(Router);
		const messageService = inject(MessageService);

		return actions$.pipe(
			ofType(AppAction.logoutUser),
			tap(() => {
				messageService.showMessage(
					MessageSeverity.INFO,
					'messages.auth.logout.title',
					'messages.auth.logout.message',
				);
				router.navigate([PageUrl.LOGIN]);
			}),
		);
	},
	{ functional: true, dispatch: false },
);

export const getUserEffect = createEffect(
	() => {
		const actions$ = inject(Actions);
		const userApi = inject(UserApiService);

		return actions$.pipe(
			ofType(AppAction.getUser),
			switchMap((payload) =>
				userApi.getUser({username: payload.username})
					.pipe(
						map((user) => AppAction.getUserSuccess({ user }))
					),
			),
		);
	},
	{ functional: true },
);
