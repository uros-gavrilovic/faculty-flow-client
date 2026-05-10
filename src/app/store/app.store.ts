import { User } from '../model/user.model';
import { Token } from '../model/token.model';

export const APP_STATE_KEY: string = 'app';

export interface AppState {
	token: Token;
	user: User;
}

export const INITIAL_APP_STATE: AppState =
	// JSON.parse(localStorage.getItem(APP_STATE_KEY)) ||
	{
	token: null,
	user: null,
};
