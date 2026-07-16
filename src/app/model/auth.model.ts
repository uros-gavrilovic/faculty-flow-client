export interface LoginRequest {
	username: string;
	password: string;
}

export interface LoginResponse {
	token: string;
	expiration: Date;
}

export interface RegisterRequest extends LoginRequest {
	firstName: string;
	lastName: string;
	email: string;
}