import { createFeatureSelector, createSelector } from '@ngrx/store';
import { APP_STATE_KEY, AppState } from './app.store';
import { Token } from '../model/token.model';
import { User } from '../model/user.model';

export const selectAppState = createFeatureSelector<AppState>(APP_STATE_KEY);

export const selectToken = createSelector(selectAppState, (state: AppState): Token => state.token);
export const selectLoggedUser = createSelector(selectAppState, (state: AppState): User => state.user);