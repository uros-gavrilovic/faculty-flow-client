import { User } from '../model/user.model';

export interface AppState {
	user: User;
}

export const INITIAL_APP_STATE: AppState = {
	user: null,
};
