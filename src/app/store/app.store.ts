import { User } from '../model/user.model';
import { Token } from '../model/token.model';
import { Reservation } from '../model/reservation.model';
import { Room } from '../model/room.model';

export const APP_STATE_KEY: string = 'app';

export interface AppState {
	token: Token;
	user: User;
	rooms: Room[];
	reservations: Reservation[];
}

export const INITIAL_APP_STATE: AppState = (() => {
	const stored: string = localStorage.getItem(APP_STATE_KEY);
	if (stored) {
		localStorage.removeItem(APP_STATE_KEY);
		return JSON.parse(stored);
	}

	return {
		token: null,
		user: null,
		rooms: null,
		reservations: null,
	};
})();