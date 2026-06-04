import { Inject, Injectable } from '@angular/core';
import { User } from '../model/user.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { LoginRequest, LoginResponse } from '../model/login.model';
import { SearchRequest, SearchResponse } from '../model/search.model';

@Injectable({
	providedIn: 'root',
})
export class UserApiService {
	readonly AUTH_API: string = environment.authApi;
	readonly USER_API: string = environment.userApi;

	constructor(private httpClient: HttpClient) {}

	login(request: LoginRequest): Observable<LoginResponse> {
		return this.httpClient.post<LoginResponse>(`${this.AUTH_API}/login`, request);
	}

	getUser(request: { uuid?: string; username?: string }): Observable<User> {
		return this.httpClient.get<User>(`${this.USER_API}`, {
			params: {
				...(request.uuid ? { uuid: request.uuid } : {}),
				...(request.username ? { username: request.username } : {}),
			},
		});
	}

	searchUsers(searchRequest: SearchRequest): Observable<SearchResponse<User>> {
		const params = {
			page: searchRequest.page,
			size: searchRequest.size,
			sortBy: searchRequest.sort ?? 'lastName',
			direction: searchRequest.order ?? 'asc',
		};

		return this.httpClient.get<SearchResponse<User>>(`${this.USER_API}/search`, { params });
	}

	updateUser(user: User): Observable<User> {
		return this.httpClient.put<User>(`${this.USER_API}`, user);
	}
}