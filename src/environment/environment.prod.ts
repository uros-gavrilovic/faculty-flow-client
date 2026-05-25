import { AppEnvironment } from '../app/model/environment.model';

const baseUrl: string = 'http://192.168.100.61:9000';

export const environment: AppEnvironment = {
	production: true,
	baseUrl,
	authApi: `${baseUrl}/api/auth`,
	userApi: `${baseUrl}/api/user`,
	roomApi: `${baseUrl}/api/room`,
	reservationApi: `${baseUrl}/api/reservation`,
	syncfusionLicense:
		'Ngo9BigBOggjGyl/VkV+XU9AclRDX3xKf0x/TGpQb19xflBPallYVBYiSV9jS3hTc0RgWHpfd3VdQ2dfWE91XA==',
};
