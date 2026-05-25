import { createFeatureSelector, createSelector } from '@ngrx/store';
import { APP_STATE_KEY, AppState } from './app.store';
import { Token } from '../model/token.model';
import { User } from '../model/user.model';
import { Room } from '../model/room.model';
import { Reservation } from '../model/reservation.model';

export const selectAppState = createFeatureSelector<AppState>(APP_STATE_KEY);

export const selectToken = createSelector(selectAppState, (state: AppState): Token => state.token);
export const selectLoggedUser = createSelector(selectAppState, (state: AppState): User => state.user);
export const selectRooms = createSelector(selectAppState, (state: AppState): Room[] => state.rooms);
export const selectReservations = createSelector(selectAppState, (state): Reservation[] => state.reservations);