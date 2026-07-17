import { AppState, INITIAL_APP_STATE } from './app.store';
import { createReducer, on } from '@ngrx/store';
import * as AppAction from './app.action';
import { User } from '../model/user.model';

export const appReducer = createReducer(
	INITIAL_APP_STATE,

	on(AppAction.loginUserSuccess, (state: AppState, { loginResponse }): AppState => {
		return {
			...state,
			token: loginResponse,
		};
	}),
	on(AppAction.getCurrentUserSuccess, (state: AppState, { user }): AppState => {
		return {
			...state,
			currentUser: user,
		};
	}),
	on(AppAction.logoutUser, (state: AppState): AppState => {
		return {
			...state,
			currentUser: null,
			token: null,
		};
	}),

	on(AppAction.clearUser, (state: AppState): AppState => {
		return {
			...state,
			user: null,
		};
	}),
	on(AppAction.getUserSuccess, (state: AppState, { user }): AppState => {
		return {
			...state,
			user: user,
		};
	}),
	on(AppAction.searchUsersSuccess, (state: AppState, { searchResponse }): AppState => {
		return {
			...state,
			users: searchResponse,
		};
	}),
	on(AppAction.updateUserSuccess, (state: AppState, { user }): AppState => {
		return {
			...state,
			user: user,
			users: {
				...state.users,
				data: state.users.data.map((u: User) => (u.uuid === user.uuid ? user : u)),
			},
		};
	}),

	on(AppAction.getRoomsSuccess, (state, { rooms }) => ({
		...state,
		rooms,
	})),

	on(AppAction.getReservationSuccess, (state: AppState, { reservation }): AppState => {
		return {
			...state,
			reservation,
		};
	}),
	on(AppAction.clearReservation, (state: AppState): AppState => {
		return {
			...state,
			reservation: null,
		};
	}),
	on(AppAction.searchReservationsSuccess, (state: AppState, { searchResponse }) => ({
		...state,
		reservations: searchResponse,
	})),

	on(AppAction.saveSearchRequest, (state, { searchRequest }) => ({
		...state,
		searchRequest,
	})),
);