import { AppState, INITIAL_APP_STATE } from './app.store';
import { createReducer, on } from '@ngrx/store';
import { loginUserSuccess } from './app.action';
import { User } from '../model/user.model';

export const appReducer = createReducer(
	INITIAL_APP_STATE,

	on(loginUserSuccess, (state: AppState, { user }): AppState => {
		return {
			...state,
			user,
		};
	}),
);