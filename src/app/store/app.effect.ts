import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { UserApiService } from '../service/user-api.service';
import * as AppAction from './app.action';
import { catchError, switchMap, map, of, tap, forkJoin, exhaustMap } from 'rxjs';
import { LoginResponse } from '../model/response/response.model';

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

export const getUserEffect = createEffect(
	() => {
		const actions$ = inject(Actions);
		const userApi = inject(UserApiService);

		return actions$.pipe(
			ofType(AppAction.getUser),
			tap(() => console.log('getUserEffect triggered')),
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
