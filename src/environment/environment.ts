import { AppEnvironment } from '../app/model/environment.model';

const baseUrl: string = 'http://localhost:9000';

export const environment: AppEnvironment = {
	production: false,
	baseUrl,
	authApi: `${baseUrl}/api/auth`,
	userApi: `${baseUrl}/api/user`,
	roomApi: `${baseUrl}/api/room`,
	reservationApi: `${baseUrl}/api/reservation`,
};
