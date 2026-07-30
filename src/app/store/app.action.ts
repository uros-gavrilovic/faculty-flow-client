import { createAction, props } from '@ngrx/store';
import { User } from '../model/user.model';
import { Reservation, ReservationFilter, ReservationRequest, ReservationReview } from '../model/reservation.model';
import { LoginRequest, LoginResponse, RegisterRequest } from '../model/auth.model';
import { Room, RoomFilter } from '../model/room.model';
import { SearchRequest, SearchResponse } from '../model/search.model';

enum AppActionType {
	// Auth
	LOG_IN = '[AUTH] Log In',
	LOG_IN_SUCCESS = '[AUTH] Log In Success',
	GET_CURRENT_USER = '[AUTH] Get Current User',
	GET_CURRENT_USER_SUCCESS = '[AUTH] Get Current User Success',
	LOG_OUT = '[AUTH] Log Out',
	REGISTER_USER = '[AUTH] Register User',

	// User
	CLEAR_USER = '[USER] Clear User',
	GET_USER = '[USER] Get User',
	GET_USER_SUCCESS = '[USER] Get User Success',
	SEARCH_USERS = '[USER] Search Users',
	SEARCH_USERS_SUCCESS = '[USER] Search Users Success',
	UPDATE_USER = '[USER] Update User',
	UPDATE_USER_SUCCESS = '[USER] Update User Success',

	// Room
	GET_ROOM = '[ROOM] Get Room',
	GET_ROOM_SUCCESS = '[ROOM] Get Room Success',
	CLEAR_ROOM = '[ROOM] Clear Room',
	GET_ROOMS = '[ROOM] Get Rooms',
	GET_ROOMS_SUCCESS = '[ROOM] Get Rooms Success',
	SEARCH_ROOMS = '[ROOM] Search Rooms',
	SEARCH_ROOMS_SUCCESS = '[ROOM] Search Rooms Success',
	CREATE_ROOM = '[ROOM] Create Room',
	UPDATE_ROOM = '[ROOM] Update Room',
	DELETE_ROOM = '[ROOM] Delete Room',

	// Reservation
	SEARCH_RESERVATIONS = '[RESV] Search Reservations',
	SEARCH_RESERVATIONS_SUCCESS = '[RESV] Search reservations Success',
	GET_RESERVATION = '[RESV] Get Reservation',
	GET_RESERVATION_SUCCESS = '[RESV] Get Reservation Success',
	CLEAR_RESERVATION = '[RESV] Clear Reservation',
	REQUEST_RESERVATION = '[RESV] Request Reservation',
	UPDATE_RESERVATION = '[RESV] Update Reservation',
	REVIEW_RESERVATION = '[RESV] Review Reservation',

	SAVE_SEARCH_REQUEST = '[SEARCH] Save Search Request',
}

export const loginUser = createAction(AppActionType.LOG_IN, props<{ request: LoginRequest }>());
export const loginUserSuccess = createAction(AppActionType.LOG_IN_SUCCESS, props<{ loginResponse: LoginResponse }>());
export const getCurrentUser = createAction(AppActionType.GET_CURRENT_USER, props<{ username: string }>());
export const getCurrentUserSuccess = createAction(AppActionType.GET_CURRENT_USER_SUCCESS, props<{ user: User }>());
export const logoutUser = createAction(AppActionType.LOG_OUT);
export const registerUser = createAction(AppActionType.REGISTER_USER, props<{ request: RegisterRequest }>());

export const getUser = createAction(AppActionType.GET_USER, props<{ uuid?: string; username?: string }>());
export const getUserSuccess = createAction(AppActionType.GET_USER_SUCCESS, props<{ user: User }>());
export const clearUser = createAction(AppActionType.CLEAR_USER);
export const searchUsers = createAction(AppActionType.SEARCH_USERS, props<{searchRequest: SearchRequest}>());
export const searchUsersSuccess = createAction(AppActionType.SEARCH_USERS_SUCCESS, props<{ searchResponse: SearchResponse<User> }>());
export const updateUser = createAction(AppActionType.UPDATE_USER, props<{user: User}>());
export const updateUserSuccess = createAction(AppActionType.UPDATE_USER_SUCCESS, props<{user: User}>());

export const getRoom = createAction(AppActionType.GET_ROOM, props<{ uuid: string }>());
export const getRoomSuccess = createAction(AppActionType.GET_ROOM_SUCCESS, props<{ room: Room }>());
export const clearRoom = createAction(AppActionType.CLEAR_ROOM);
export const getRooms = createAction(AppActionType.GET_ROOMS);
export const getRoomsSuccess = createAction(AppActionType.GET_ROOMS_SUCCESS, props<{ rooms: Room[] }>());
export const searchRooms = createAction(AppActionType.SEARCH_ROOMS, props<{ searchRequest: SearchRequest<RoomFilter> }>());
export const searchRoomsSuccess = createAction(AppActionType.SEARCH_ROOMS_SUCCESS, props<{ searchResponse: SearchResponse<Room> }>());
export const createRoom = createAction(AppActionType.CREATE_ROOM, props<{ room: Room }>());
export const updateRoom = createAction(AppActionType.UPDATE_ROOM, props<{ room: Room }>());
export const deleteRoom = createAction(AppActionType.DELETE_ROOM, props<{ uuid: string }>());

export const searchReservations = createAction(AppActionType.SEARCH_RESERVATIONS, props<{ searchRequest: SearchRequest<ReservationFilter> }>());
export const searchReservationsSuccess = createAction(AppActionType.SEARCH_RESERVATIONS_SUCCESS, props<{ searchResponse: SearchResponse<Reservation> }>());
export const getReservation = createAction(AppActionType.GET_RESERVATION, props<{ uuid: string }>());
export const getReservationSuccess = createAction(AppActionType.GET_RESERVATION_SUCCESS, props<{ reservation: Reservation }>());
export const clearReservation = createAction(AppActionType.CLEAR_RESERVATION);
export const requestReservation = createAction(AppActionType.REQUEST_RESERVATION, props<{ request: ReservationRequest }>());
export const updateReservation = createAction(AppActionType.UPDATE_RESERVATION, props<{ reservation: Reservation }>());
export const reviewReservation = createAction(AppActionType.REVIEW_RESERVATION, props<{ review: ReservationReview }>());

export const saveSearchRequest = createAction(AppActionType.SAVE_SEARCH_REQUEST, props<{ searchRequest: SearchRequest<any> }>());