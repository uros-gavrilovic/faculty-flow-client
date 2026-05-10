import { AppState, INITIAL_APP_STATE } from './app.store';
import { createReducer, on } from '@ngrx/store';
import { getUserSuccess, loginUserSuccess } from './app.action';

export const appReducer = createReducer(
	INITIAL_APP_STATE,

	on(loginUserSuccess, (state: AppState, { loginResponse }): AppState => {
		return {
			...state,
			token: loginResponse,
		};
	}),
	on(getUserSuccess, (state: AppState, { user }): AppState => {
		console.log('getUserSuccess reducer triggered with user:', user);

		return {
			...state,
			user: user,
		};
	}),
);