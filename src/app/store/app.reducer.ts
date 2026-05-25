import { AppState, INITIAL_APP_STATE } from './app.store';
import { createReducer, on } from '@ngrx/store';
import * as AppAction from './app.action';

export const appReducer = createReducer(
	INITIAL_APP_STATE,

	on(AppAction.loginUserSuccess, (state: AppState, { loginResponse }): AppState => {
		return {
			...state,
			token: loginResponse,
		};
	}),
	on(AppAction.logoutUser, (state: AppState): AppState => {
		return {
			...state,
			user: null,
			token: null,
		};
	}),
	on(AppAction.getUserSuccess, (state: AppState, { user }): AppState => {
		return {
			...state,
			user: user,
		};
	}),

	on(AppAction.getRoomsSuccess, (state, { rooms }) => ({
		...state,
		rooms,
	})),

	on(AppAction.loadReservationsSuccess, (state, { reservations }) => ({
		...state,
		reservations,
	})),
	on(AppAction.requestReservationSuccess, (state, { reservation }) => ({
		...state,
		reservations: [...state.reservations, reservation],
	})),
	on(AppAction.reviewReservationSuccess, (state, { reservation }) => ({
		...state,
		reservations: state.reservations.map((r) => (r.uuid === reservation.uuid ? reservation : r)),
	})),
);