import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
	Reservation,
	ReservationFilter,
	ReservationRequest,
	ReservationReview,
} from '../model/reservation.model';
import { environment } from '../../environment/environment';
import { SearchRequest, SearchResponse } from '../model/search.model';
import { User } from '../model/user.model';

@Injectable({ providedIn: 'root' })
export class ReservationApiService {
	readonly RESERVATION_API: string = environment.reservationApi;

	constructor(private httpClient: HttpClient) {}

	searchReservations(
		searchRequest: SearchRequest<ReservationFilter>,
	): Observable<SearchResponse<Reservation>> {
		return this.httpClient.post<SearchResponse<Reservation>>(
			`${this.RESERVATION_API}/search`,
			searchRequest,
		);
	}
	getReservation(uuid: string): Observable<Reservation> {
		return this.httpClient.get<Reservation>(`${this.RESERVATION_API}`, {
			params: {uuid}
		});
	}

	requestReservation(request: ReservationRequest): Observable<Reservation> {
		return this.httpClient.post<Reservation>(`${this.RESERVATION_API}/request`, request);
	}

	updateReservation(reservation: Reservation): Observable<Reservation> {
		return this.httpClient.put<Reservation>(`${this.RESERVATION_API}`, reservation);
	}

	reviewReservation(review: ReservationReview): Observable<Reservation> {
		return this.httpClient.post<Reservation>(`${this.RESERVATION_API}/review`, review);
	}
}
