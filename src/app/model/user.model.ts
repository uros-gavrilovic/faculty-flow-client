export interface User {
	uuid?: string;
	firstName: string;
	lastName: string;
	email: string;
	username: string;
	isVerified?: boolean;
	roles: UserRole[];
}

export enum UserRole {
	USER = 'USER',
	ADMINISTRATOR = 'ADMINISTRATOR',
}
