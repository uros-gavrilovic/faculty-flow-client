import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Room, RoomFilter } from '../model/room.model';
import { SearchRequest, SearchResponse } from '../model/search.model';
import { Reservation } from '../model/reservation.model';

@Injectable({
	providedIn: 'root',
})
export class RoomApiService {
	readonly ROOM_API: string = environment.roomApi;

	constructor(private httpClient: HttpClient) {}

	getRoom(uuid: string): Observable<Room> {
		return this.httpClient.get<Room>(`${this.ROOM_API}`, {
			params: { uuid },
		});
	}

	getRooms(): Observable<Room[]> {
		return this.httpClient.get<Room[]>(`${this.ROOM_API}/all`);
	}

	searchRooms(searchRequest: SearchRequest<RoomFilter>): Observable<SearchResponse<Room>> {
		return this.httpClient.post<SearchResponse<Room>>(`${this.ROOM_API}/search`, searchRequest);
	}

	createRoom(room: Room): Observable<Room> {
		return this.httpClient.post<Room>(`${this.ROOM_API}`, room);
	}

	updateRoom(room: Room): Observable<Room> {
		return this.httpClient.put<Room>(`${this.ROOM_API}`, room);
	}

	deleteRoom(uuid: string): Observable<void> {
		return this.httpClient.delete<void>(`${this.ROOM_API}/${uuid}`);
	}
}