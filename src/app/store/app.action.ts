import { createAction, props } from '@ngrx/store';
import { User } from '../model/user.model';
import {
	Reservation,
	ReservationFilter,
	ReservationRequest,
	ReservationReview,
} from '../model/reservation.model';
import { LoginRequest, LoginResponse } from '../model/login.model';
import { Room } from '../model/room.model';
import { SearchRequest, SearchResponse } from '../model/search.model';

enum AppActionType {
	// Auth
	LOG_IN = '[AUTH] Log In',
	LOG_IN_SUCCESS = '[AUTH] Log In Success',
	GET_CURRENT_USER = '[AUTH] Get Current User',
	GET_CURRENT_USER_SUCCESS = '[AUTH] Get Current User Success',
	LOG_OUT = '[AUTH] Log Out',
	GET_USER = '[AUTH] Get User',
	GET_USER_SUCCESS = '[AUTH] Get User Success',

	// User
	SEARCH_USERS = '[USER] Search Users',
	SEARCH_USERS_SUCCESS = '[USER] Search Users Success',
	UPDATE_USER = '[USER] Update User',
	UPDATE_USER_SUCCESS = '[USER] Update User Success',

	// Room
	GET_ROOMS = '[ROOM] Get Rooms',
	GET_ROOMS_SUCCESS = '[ROOM] Get Rooms Success',

	// Reservation
	SEARCH_RESERVATIONS = '[ROOM] Search Reservations',
	SEARCH_RESERVATIONS_SUCCESS = '[ROOM] Search reservations Success',
	LOAD_RESERVATIONS = '[RESV] Load Reservations',
	LOAD_RESERVATIONS_SUCCESS = '[RESV] Load Reservations Success',
	REQUEST_RESERVATION = '[RESV] Request Reservation',
	REQUEST_RESERVATION_SUCCESS = '[RESV] Request Reservation Success',
	REVIEW_RESERVATION = '[RESV] Review Reservation',
	REVIEW_RESERVATION_SUCCESS = '[RESV] Review Reservation Success',
}

export const loginUser = createAction(AppActionType.LOG_IN, props<{ request: LoginRequest }>());
export const loginUserSuccess = createAction(AppActionType.LOG_IN_SUCCESS, props<{ loginResponse: LoginResponse }>(),);
export const getCurrentUser = createAction(AppActionType.GET_CURRENT_USER, props<{ username: string }>());
export const getCurrentUserSuccess = createAction(AppActionType.GET_CURRENT_USER_SUCCESS, props<{ user: User }>());
export const logoutUser = createAction(AppActionType.LOG_OUT);

export const getUser = createAction(AppActionType.GET_USER, props<{ uuid?: string; username?: string }>(),);
export const getUserSuccess = createAction(AppActionType.GET_USER_SUCCESS, props<{ user: User }>());
export const searchUsers = createAction(AppActionType.SEARCH_USERS, props<{searchRequest: SearchRequest}>());
export const searchUsersSuccess = createAction(AppActionType.SEARCH_USERS_SUCCESS, props<{ searchResponse: SearchResponse<User> }>());
export const updateUser = createAction(AppActionType.UPDATE_USER, props<{user: User}>());
export const updateUserSuccess = createAction(AppActionType.UPDATE_USER_SUCCESS, props<{user: User}>());

export const getRooms = createAction(AppActionType.GET_ROOMS);
export const getRoomsSuccess = createAction(AppActionType.GET_ROOMS_SUCCESS, props<{ rooms: Room[] }>(),);

export const searchReservations = createAction(AppActionType.SEARCH_RESERVATIONS, props<{ searchRequest: SearchRequest<ReservationFilter> }>());
export const searchReservationsSuccess = createAction(AppActionType.SEARCH_RESERVATIONS_SUCCESS, props<{ searchResponse: SearchResponse<Reservation> }>(),);
export const loadReservations = createAction(AppActionType.LOAD_RESERVATIONS, props<{ start: Date; end: Date }>(),);
export const loadReservationsSuccess = createAction(AppActionType.LOAD_RESERVATIONS_SUCCESS, props<{ reservations: Reservation[] }>(),);
export const requestReservation = createAction(AppActionType.REQUEST_RESERVATION, props<{ request: ReservationRequest }>(),);
export const requestReservationSuccess = createAction(AppActionType.REQUEST_RESERVATION_SUCCESS, props<{ reservation: Reservation }>(),);
export const reviewReservation = createAction(AppActionType.REVIEW_RESERVATION, props<{ review: ReservationReview }>(),);
export const reviewReservationSuccess = createAction(AppActionType.REVIEW_RESERVATION_SUCCESS, props<{ reservation: Reservation }>(),);