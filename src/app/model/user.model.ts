export interface User {
	uuid: string;
	firstName: string;
	lastName: string;
	email: string;
	username: string;
	roles: UserRole[];
}

export enum UserRole {
	USER = 'USER',
	ADMINISTRATOR = 'ADMINISTRATOR',
}
