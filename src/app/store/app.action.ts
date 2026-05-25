import { createAction, props } from '@ngrx/store';
import { User } from '../model/user.model';
import { Reservation, ReservationRequest, ReservationReview } from '../model/reservation.model';
import { LoginRequest, LoginResponse } from '../model/login.model';
import { Room } from '../model/room.model';

enum AppActionType {
	// Auth
	LOG_IN = '[AUTH] Log In',
	LOG_IN_SUCCESS = '[AUTH] Log In Success',
	LOG_OUT = '[AUTH] Log Out',
	GET_USER = '[AUTH] Get User',
	GET_USER_SUCCESS = '[AUTH] Get User Success',

	// Room
	GET_ROOMS = '[ROOM] Get Rooms',
	GET_ROOMS_SUCCESS = '[ROOM] Get Rooms Success',

	// Reservation
	LOAD_RESERVATIONS = '[RESV] Load Reservations',
	LOAD_RESERVATIONS_SUCCESS = '[RESV] Load Reservations Success',
	REQUEST_RESERVATION = '[RESV] Request Reservation',
	REQUEST_RESERVATION_SUCCESS = '[RESV] Request Reservation Success',
	REVIEW_RESERVATION = '[RESV] Review Reservation',
	REVIEW_RESERVATION_SUCCESS = '[RESV] Review Reservation Success',
}

export const loginUser = createAction(AppActionType.LOG_IN, props<{ request: LoginRequest }>());
export const loginUserSuccess = createAction(
	AppActionType.LOG_IN_SUCCESS,
	props<{ loginResponse: LoginResponse }>(),
);
export const logoutUser = createAction(AppActionType.LOG_OUT);
export const getUser = createAction(
	AppActionType.GET_USER,
	props<{ uuid?: string; username?: string }>(),
);
export const getUserSuccess = createAction(AppActionType.GET_USER_SUCCESS, props<{ user: User }>());

export const getRooms = createAction(AppActionType.GET_ROOMS);
export const getRoomsSuccess = createAction(AppActionType.GET_ROOMS_SUCCESS, props<{ rooms: Room[] }>(),);

export const loadReservations = createAction(AppActionType.LOAD_RESERVATIONS, props<{ start: Date; end: Date }>(),);
export const loadReservationsSuccess = createAction(AppActionType.LOAD_RESERVATIONS_SUCCESS, props<{ reservations: Reservation[] }>(),);
export const requestReservation = createAction(AppActionType.REQUEST_RESERVATION, props<{ request: ReservationRequest }>(),);
export const requestReservationSuccess = createAction(AppActionType.REQUEST_RESERVATION_SUCCESS, props<{ reservation: Reservation }>(),);
export const reviewReservation = createAction(AppActionType.REVIEW_RESERVATION, props<{ review: ReservationReview }>(),);
export const reviewReservationSuccess = createAction(AppActionType.REVIEW_RESERVATION_SUCCESS, props<{ reservation: Reservation }>(),);