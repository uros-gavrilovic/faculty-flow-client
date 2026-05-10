import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { UserApiService } from '../service/user-api.service';
import * as AppAction from './app.action';
import { catchError, switchMap, map, of, tap } from 'rxjs';
import { User } from '../model/user.model';

export const loginEffect = createEffect(
	() => {
		const actions$ = inject(Actions);
		const userApi = inject(UserApiService);

		return actions$.pipe(
			ofType(AppAction.loginUser),
			switchMap(({ request }) =>
				userApi.login(request)
					.pipe(
						map((user: User) => AppAction.loginUserSuccess({ user }))
					)
			),
		);
	},
	{ functional: true },
);
