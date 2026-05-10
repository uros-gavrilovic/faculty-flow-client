import { createFeatureSelector, createSelector } from '@ngrx/store';
import { APP_STATE_KEY, AppState } from './app.store';
import { Token } from '../model/token.model';

const selectAppState = createFeatureSelector<AppState>(APP_STATE_KEY);

export const selectToken = createSelector(selectAppState, (state: AppState): Token => state.token);