import { createAction, props } from '@ngrx/store';
import { LoginRequest } from '../model/request/request.model';
import { User } from '../model/user.model';
import { LoginResponse } from '../model/response/response.model';

enum AppActionType {
	LOG_IN = '[AUTH] Log In',
	LOG_IN_SUCCESS = '[AUTH] Log In Success',
	LOG_OUT = '[AUTH] Log Out',
	GET_USER = '[AUTH] Get User',
	GET_USER_SUCCESS = '[AUTH] Get User Success',
}

export const loginUser = createAction(AppActionType.LOG_IN, props<{request: LoginRequest}>());
export const loginUserSuccess = createAction(AppActionType.LOG_IN_SUCCESS, props<{loginResponse: LoginResponse }>());
export const logoutUser = createAction(AppActionType.LOG_OUT);
export const getUser = createAction(AppActionType.GET_USER, props<{uuid?: string, username?: string}>());
export const getUserSuccess = createAction(AppActionType.GET_USER_SUCCESS, props<{user: User}>());