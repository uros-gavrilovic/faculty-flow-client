import { ReservationStatus } from './reservation.model';

export interface ScheduleEvent {
	Id: string;
	Subject: string;
	StartTime: Date;
	EndTime: Date;
	Room: string;
	ReservedBy: string;
	Status: ReservationStatus;
	Note: string;
	IsReadonly?: boolean;
	CssClass?: string;
}