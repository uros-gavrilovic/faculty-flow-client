import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Room } from '../model/room.model';

@Injectable({
	providedIn: 'root',
})
export class RoomApiService {

	readonly ROOM_API: string = environment.roomApi;

	constructor(private httpClient: HttpClient) {}

	getRooms(): Observable<Room[]> {
		return this.httpClient.get<Room[]>(`${this.ROOM_API}`);
	}
}