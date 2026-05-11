import { AppState, INITIAL_APP_STATE } from './app.store';
import { createReducer, on } from '@ngrx/store';
import { getUserSuccess, loginUserSuccess, logoutUser } from './app.action';

export const appReducer = createReducer(
	INITIAL_APP_STATE,

	on(loginUserSuccess, (state: AppState, { loginResponse }): AppState => {
		return {
			...state,
			token: loginResponse,
		};
	}),
	on(logoutUser, (state: AppState): AppState => {
		return {
			...state,
			user: null,
			token: null,
		};
	}),
	on(getUserSuccess, (state: AppState, { user }): AppState => {
		return {
			...state,
			user: user,
		};
	}),
);