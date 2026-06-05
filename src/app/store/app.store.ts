import { User } from '../model/user.model';
import { Token } from '../model/token.model';
import { Reservation } from '../model/reservation.model';
import { Room } from '../model/room.model';
import { SearchResponse } from '../model/search.model';

export const APP_STATE_KEY: string = 'app';

export interface AppState {
	token: Token;
	currentUser: User;
	user: User;
	users: SearchResponse<User>;
	rooms: Room[];
	reservations: Reservation[];
	reservationsSearch: SearchResponse<Reservation>;
}

export const INITIAL_APP_STATE: AppState = (() => {
	const stored: string = localStorage.getItem(APP_STATE_KEY);
	if (stored) {
		localStorage.removeItem(APP_STATE_KEY);
		return JSON.parse(stored);
	}

	return {
		token: null,
		currentUser: null,
		user: null,
		users: null,
		rooms: null,
		reservations: null,
		reservationsSearch: null,
	};
})();