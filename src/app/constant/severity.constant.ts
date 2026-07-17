import { User, UserRole } from '../model/user.model';
import { Severity } from '../model/ui.model';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import * as AppSelector from '../store/app.selector';
import { ReservationStatus } from '../model/reservation.model';

export const reservationStatusSeverityMap: Record<ReservationStatus, Severity> = {
	[ReservationStatus.PENDING]: Severity.SECONDARY,
	[ReservationStatus.CANCELED]: Severity.WARN,
	[ReservationStatus.ACCEPTED]: Severity.SUCCESS,
	[ReservationStatus.REJECTED]: Severity.DANGER,
};

export const roleTagSeverityMap: Record<UserRole, Severity> = {
	[UserRole.ADMINISTRATOR]: Severity.DANGER,
	[UserRole.USER]: Severity.SUCCESS,
};

const avatarRolePriority = [
	UserRole.ADMINISTRATOR,
	UserRole.USER
] as const;

export function getAvatarSeverity(user: User): Severity | undefined {
	const role = avatarRolePriority.find((role) => user.roles.includes(role));
	return role && roleTagSeverityMap[role];
}

export function getAccountVerifiedSeverity(user: User): Severity {
	return user.isVerified ? Severity.SECONDARY : Severity.WARN;
}