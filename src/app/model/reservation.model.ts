
export enum ReservationStatus {
	PENDING = 'PENDING',
	CANCELED = 'CANCELED',
	ACCEPTED = 'ACCEPTED',
	REJECTED = 'REJECTED',
}

export interface Reservation {
	uuid: string;
	name: string;
	room: string;
	startTime: Date;
	endTime: Date;
	reservedBy: string;
	reviewedBy: string | null;
	eventType: EventType;
	status: ReservationStatus;
	note: string | null;
	comment: string | null;
}

export enum EventType {
	LECTURE = 'LECTURE',
	EXERCISE = 'EXERCISE',
	LABORATORY = 'LABORATORY',
	EXAM = 'EXAM',
	CONSULTATION = 'CONSULTATION',
	OTHER = 'OTHER',
}

export interface ReservationFilter {
	name?: string;
	room?: string;
	startTime?: Date;
	endTime?: Date;
	reservedBy?: string;
	reviewedBy?: string;
	status?: ReservationStatus;
}

export interface ReservationRequest {
	name: string;
	roomCode: string;
	eventType: EventType;
	startTime: Date;
	endTime: Date;
	reservedBy: string;
	note?: string;
}

export interface ReservationReview {
	uuid: string;
	status: ReservationStatus;
	comment?: string;
}
