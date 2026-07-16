import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { UserApiService } from '../service/user-api.service';
import * as AppAction from './app.action';
import * as AppSelector from './app.selector';
import { catchError, switchMap, map, tap, withLatestFrom, take, pipe } from 'rxjs';
import { Router } from '@angular/router';
import { MessageService } from '../service/message.service';
import { MessageSeverity } from '../model/message-severity.model';
import { PageUrl } from '../constant/page-url.constant';
import { ReservationApiService } from '../service/reservation-api.service';
import { LoginResponse } from '../model/login.model';
import { RoomApiService } from '../service/room-api.service';
import { Store } from '@ngrx/store';

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
							AppAction.getCurrentUser({ username: request.username }),
						]),
					),
			),
		);
	}, { functional: true },
);

export const getCurrentUserEffect = createEffect(
	() => {
		const actions$ = inject(Actions);
		const userApi = inject(UserApiService);

		return actions$.pipe(
			ofType(AppAction.getCurrentUser),
			switchMap(({ username }) =>
				userApi
					.getUser({ username })
					.pipe(map((user) => AppAction.getCurrentUserSuccess({ user }))),
			),
		);
	}, { functional: true },
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
	}, { functional: true, dispatch: false },
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
	}, { functional: true, dispatch: false },
);

export const getUserEffect = createEffect(
	() => {
		const actions$ = inject(Actions);
		const userApi = inject(UserApiService);

		return actions$.pipe(
			ofType(AppAction.getUser),
			switchMap((payload) =>
				userApi
					.getUser({ username: payload.username, uuid: payload.uuid })
					.pipe(map((user) => AppAction.getUserSuccess({ user }))),
			),
		);
	}, { functional: true },
);

export const getUsersEffect = createEffect(
	() => {
		const actions$ = inject(Actions);
		const userApi = inject(UserApiService);

		return actions$.pipe(
			ofType(AppAction.searchUsers),
			switchMap((payload) =>
				userApi
					.searchUsers(payload.searchRequest)
					.pipe(map((searchResponse) => AppAction.searchUsersSuccess({ searchResponse }))),
			),
		);
	}, { functional: true },
);

export const updateUserEffect = createEffect(
	() => {
		const store = inject(Store);
		const actions$ = inject(Actions);
		const userApi = inject(UserApiService);
		const messageService = inject(MessageService);

		return actions$.pipe(
			ofType(AppAction.updateUser),
			withLatestFrom(store.select(AppSelector.selectSearchRequest)),
			switchMap(([payload, searchRequest]) =>
				userApi.updateUser(payload.user).pipe(
					tap(() =>
						messageService.showMessage(
							MessageSeverity.SUCCESS,
							'messages.user-management.user-updated.title',
							'messages.user-management.user-updated.message',
						),
					),
					pipe(map(() => AppAction.searchUsers({ searchRequest }))),
				),
			),
		);
	},
	{ functional: true },
);

export const getRoomsEffect = createEffect(
	() => {
		const actions$ = inject(Actions);
		const roomApi = inject(RoomApiService);

		return actions$.pipe(
			ofType(AppAction.getRooms),
			switchMap(() => roomApi.getRooms().pipe(map((rooms) => AppAction.getRoomsSuccess({ rooms })))),
		)},
		{functional: true}
);

export const searchReservationsEffect = createEffect(
	() => {
		const actions$ = inject(Actions);
		const reservationApi = inject(ReservationApiService);

		return actions$.pipe(
			ofType(AppAction.searchReservations),
			switchMap(({ searchRequest }) =>
				reservationApi
					.searchReservations(searchRequest)
					.pipe(map((searchResponse) => AppAction.searchReservationsSuccess({ searchResponse })),),
			),
		);
	}, { functional: true },
);

export const requestReservationEffect = createEffect(
	() => {
		const actions$ = inject(Actions);
		const reservationApi = inject(ReservationApiService);
		const store = inject(Store);

		return actions$.pipe(
			ofType(AppAction.requestReservation),
			withLatestFrom(store.select(AppSelector.selectSearchRequest)),
			switchMap(([{ request }, searchRequest]) =>
				reservationApi
					.requestReservation(request)
					.pipe(map(() => AppAction.searchReservations({ searchRequest }))),
			),
		);
	},
	{ functional: true },
);

export const reviewReservationEffect = createEffect(
	() => {
		const store = inject(Store);
		const actions$ = inject(Actions);
		const reservationApi = inject(ReservationApiService);

		return actions$.pipe(
			ofType(AppAction.reviewReservation),
			withLatestFrom(store.select(AppSelector.selectSearchRequest)),
			switchMap(([{ review }, searchRequest]) =>
				reservationApi
					.reviewReservation(review)
					.pipe(map(() => AppAction.searchReservations({ searchRequest }))),
			),
		);
	}, { functional: true },
);

export const saveSearchRequestEffect = createEffect(
	() => {
		const actions$ = inject(Actions);

		return actions$.pipe(
			ofType(AppAction.searchReservations, AppAction.searchUsers),
			map(({ searchRequest }) => AppAction.saveSearchRequest({ searchRequest })),
		);
	}, { functional: true },
);