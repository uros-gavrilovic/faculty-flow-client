import { createAction, props } from '@ngrx/store';
import { LoginRequest } from '../model/request/auth.model';
import { User } from '../model/user.model';

enum AppActionType {
	LOG_IN = '[AUTH] Log In',
	LOG_IN_SUCCESS = '[AUTH] Log In Success',
}

export const loginUser = createAction(AppActionType.LOG_IN, props<{request: LoginRequest}>());
export const loginUserSuccess = createAction(AppActionType.LOG_IN_SUCCESS, props<{user: User }>());

