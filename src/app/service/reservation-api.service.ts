import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation, ReservationRequest, ReservationReview } from '../model/reservation.model';
import { environment } from '../../environment/environment';
import { SearchRequest, SearchResponse } from '../model/search.model';
import { User } from '../model/user.model';

@Injectable({ providedIn: 'root' })
export class ReservationApiService {
	readonly RESERVATION_API: string = environment.reservationApi;

	constructor(private httpClient: HttpClient) {}

	private toLocalDateTime(date: Date): string {
		return date.toISOString().slice(0, 19);
	}

	private dateParams(start: Date, end: Date): HttpParams {
		return new HttpParams()
			.set('start', this.toLocalDateTime(start))
			.set('end', this.toLocalDateTime(end));
	}

	searchReservations(searchRequest: SearchRequest): Observable<SearchResponse<Reservation>> {
		const params = {
			page: searchRequest.page,
			size: searchRequest.size,
			sortBy: searchRequest.sort ?? 'startTime',
			direction: searchRequest.order ?? 'asc',
		};

		return this.httpClient.get<SearchResponse<Reservation>>(`${this.RESERVATION_API}/search`, { params });
	}
	getReservations(start: Date, end: Date): Observable<Reservation[]> {
		return this.httpClient.get<Reservation[]>(this.RESERVATION_API, {
			params: this.dateParams(start, end),
		});
	}

	getReservationsByRoom(roomCode: string, start: Date, end: Date): Observable<Reservation[]> {
		return this.httpClient.get<Reservation[]>(`${this.RESERVATION_API}/${roomCode}`, {
			params: this.dateParams(start, end),
		});
	}

	getReservationRequests(start: Date, end: Date): Observable<Reservation[]> {
		return this.httpClient.get<Reservation[]>(`${this.RESERVATION_API}/request`, {
			params: this.dateParams(start, end),
		});
	}

	requestReservation(request: ReservationRequest): Observable<Reservation> {
		return this.httpClient.post<Reservation>(`${this.RESERVATION_API}/request`, request);
	}

	reviewReservation(review: ReservationReview): Observable<Reservation> {
		return this.httpClient.post<Reservation>(`${this.RESERVATION_API}/review`, review);
	}
}
