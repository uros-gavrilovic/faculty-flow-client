import { Inject, Injectable } from '@angular/core';
import { LoginRequest } from '../model/request/auth.model';
import { User } from '../model/user.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
	providedIn: 'root'
})
export class UserApiService {

	constructor(
		private httpClient: HttpClient,
	) { }

	login(request: LoginRequest): Observable<User> {
		return this.httpClient.post<User>(`${environment.authApi}/login`, request)
	}
}