import { createFeatureSelector, createSelector } from '@ngrx/store';
import { APP_STATE_KEY, AppState } from './app.store';
import { Token } from '../model/token.model';
import { User } from '../model/user.model';
import { Room } from '../model/room.model';
import { Reservation } from '../model/reservation.model';
import { SearchRequest, SearchResponse } from '../model/search.model';

export const selectAppState = createFeatureSelector<AppState>(APP_STATE_KEY);

export const selectToken = createSelector(selectAppState, (state: AppState): Token => state.token);
export const selectCurrentUser = createSelector(selectAppState, (state: AppState): User => state.currentUser);
export const selectUser = createSelector(selectAppState, (state: AppState): User => state.user);
export const selectUsers = createSelector(selectAppState, (state: AppState): SearchResponse<User> => state.users);
export const selectRooms = createSelector(selectAppState, (state: AppState): Room[] => state.rooms);
export const selectReservations = createSelector(selectAppState, (state: AppState): SearchResponse<Reservation> => state.reservations);
export const selectSearchRequest = createSelector(selectAppState, (state: AppState): SearchRequest<any> => state.searchRequest);