import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { UserApiService } from '../service/user-api.service';
import * as AppAction from './app.action';
import { catchError, switchMap, map, tap } from 'rxjs';
import { Router } from '@angular/router';
import { MessageService } from '../service/message.service';
import { MessageSeverity } from '../model/message-severity.model';
import { PageUrl } from '../constant/page-url.constant';
import { ReservationApiService } from '../service/reservation-api.service';
import { Reservation } from '../model/reservation.model';
import { LoginResponse } from '../model/login.model';
import { RoomApiService } from '../service/room-api.service';

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
	},
	{ functional: true },
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
				userApi.getUser({ username: payload.username, uuid: payload.uuid }).pipe(map((user) => AppAction.getUserSuccess({ user })),),
			),
		);
	},
	{ functional: true },
);

export const getUsersEffect = createEffect(
	() => {
		const actions$ = inject(Actions);
		const userApi = inject(UserApiService);

		return actions$.pipe(
			ofType(AppAction.searchUsers),
			switchMap((payload) => userApi.searchUsers(payload.searchRequest).pipe(
				map((searchResponse) => AppAction.searchUsersSuccess({ searchResponse })))
			),
		);
	},
	{ functional: true },
);

export const updateUserEffect = createEffect(
	() => {
		const actions$ = inject(Actions);
		const userApi = inject(UserApiService);
		const messageService = inject(MessageService);

		return actions$.pipe(
			ofType(AppAction.updateUser),
			switchMap((payload) =>
				userApi.updateUser(payload.user).pipe(
					tap(() =>
						messageService.showMessage(
							MessageSeverity.SUCCESS,
							'messages.user-management.user-updated.title',
							'messages.user-management.user-updated.message',
						),
					),
					map((user) => AppAction.updateUserSuccess({ user })),
				),
			),
		);
	},
	{ functional: true },
);

export const getRoomsEffect = createEffect(
	() => {
		const actions$ = inject(Actions);
		const roomApi = inject(RoomApiService)

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
					.pipe(map((searchResponse) => AppAction.searchReservationsSuccess({ searchResponse }))),
			),
		);
	},
	{ functional: true },
);

export const loadReservationsEffect = createEffect(
	() => {
		const actions$ = inject(Actions);
		const reservationApi = inject(ReservationApiService);

		return actions$.pipe(
			ofType(AppAction.loadReservations),
			switchMap(({ start, end }) =>
				reservationApi
					.getReservations(start, end)
					.pipe(map((reservations) => AppAction.loadReservationsSuccess({ reservations }))),
			),
		);
	},
	{ functional: true },
);

export const requestReservationEffect = createEffect(
	() => {
		const actions$ = inject(Actions);
		const reservationApi = inject(ReservationApiService);

		return actions$.pipe(
			ofType(AppAction.requestReservation),
			switchMap((payload) =>
				reservationApi
					.requestReservation(payload.request)
					.pipe(
						map((reservation: Reservation) =>
							AppAction.requestReservationSuccess({ reservation }),
						),
					),
			),
		);
	},
	{ functional: true },
);

export const reviewReservationEffect = createEffect(
	() => {
		const actions$ = inject(Actions);
		const reservationApi = inject(ReservationApiService);

		return actions$.pipe(
			ofType(AppAction.reviewReservation),
			switchMap(({ review }) =>
				reservationApi
					.reviewReservation(review)
					.pipe(map((reservation) => AppAction.reviewReservationSuccess({ reservation }))),
			),
		);
	},
	{ functional: true },
);