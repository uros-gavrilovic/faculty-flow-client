import { EventType, ReservationStatus } from './reservation.model';

export interface ScheduleEvent {
	Id: string;
	Subject: string;
	StartTime: Date;
	EndTime: Date;
	Location: string;
	ReservedBy: string;
	ReviewedBy: string;
	Type: EventType;
	Status: ReservationStatus;
	Note: string;
	Comment: string;
	IsReadonly?: boolean;
	CssClass?: string;
}