import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Room, RoomFilter } from '../model/room.model';
import { SearchRequest, SearchResponse } from '../model/search.model';

@Injectable({
	providedIn: 'root',
})
export class RoomApiService {
	readonly ROOM_API: string = environment.roomApi;

	constructor(private httpClient: HttpClient) {}

	getRooms(): Observable<Room[]> {
		return this.httpClient.get<Room[]>(`${this.ROOM_API}`);
	}

	searchRooms(searchRequest: SearchRequest<RoomFilter>): Observable<SearchResponse<Room>> {
		return this.httpClient.post<SearchResponse<Room>>(`${this.ROOM_API}/search`, searchRequest);
	}
}