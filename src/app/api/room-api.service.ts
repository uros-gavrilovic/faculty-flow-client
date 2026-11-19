import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Room, RoomFilter } from '../model/room.model';
import { SearchRequest, SearchResponse } from '../model/search.model';

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

	/** Resolves a room by its exact code using the search endpoint (which matches codes by "contains"). */
	findByCode(code: string): Observable<Room | null> {
		const request: SearchRequest<RoomFilter> = {
			page: 0,
			size: 10,
			sortBy: 'code',
			direction: 'ASC',
			filter: { code },
		};

		return this.searchRooms(request).pipe(
			map((response) => Array.from(response?.data ?? []).find((room) => room.code === code) ?? null),
		);
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