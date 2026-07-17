import { Component, effect, OnInit, Signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import {
	EventType,
	Reservation,
	ReservationRequest,
	ReservationStatus,
} from '../../../model/reservation.model';
import { PRIMENG_MODULES } from '../../../modules/ui.module';
import { Store } from '@ngrx/store';
import * as AppAction from '../../../store/app.action';
import { COMMON_MODULES } from '../../../modules/common.module';
import { selectCurrentUser, selectRooms } from '../../../store/app.selector';
import { Room } from '../../../model/room.model';
import { User, UserRole } from '../../../model/user.model';
import * as UtilFunction from '../../../util/util-functions';
import { required } from '@angular/forms/signals';

export interface RequestDialogData {
	startTime?: Date;
	endTime?: Date;
	reservation?: Reservation;
}

@Component({
	selector: 'app-request-reservation-modal',
	imports: [COMMON_MODULES, PRIMENG_MODULES],
	templateUrl: './request-reservation-modal.component.html',
	styleUrl: './request-reservation-modal.component.scss',
})
export class RequestReservationModalComponent implements OnInit {
	form: FormGroup;
	submitting: boolean;
	isEditMode: boolean;
	isReadOnly: boolean;

	rooms: Signal<Room[]>;
	loggedUser: Signal<User>;

	reservation?: Reservation;

	readonly eventTypes: EventType[] = Object.values(EventType);

	constructor(
		private store: Store,
		private ref: DynamicDialogRef,
		private formBuilder: FormBuilder,
		private config: DynamicDialogConfig<RequestDialogData>,
	) {
		this.initDispatch();
	}

	ngOnInit(): void {
		this.reservation = this.config.data?.reservation;
		this.isEditMode = !!this.reservation;
		this.isReadOnly = this.isEditMode && this.reservation?.status !== ReservationStatus.PENDING;
		this.initForm();
	}

	private initDispatch(): void {
		this.loggedUser = this.store.selectSignal(selectCurrentUser);
		this.rooms = this.store.selectSignal(selectRooms);

		effect(() => {
			const availableRooms: Room[] = this.rooms();
			if (!availableRooms?.length) this.store.dispatch(AppAction.getRooms());
		});
	}

	private initForm(): void {
		const data: RequestDialogData = this.config.data;
		const reservation = this.reservation;

		this.form = this.formBuilder.group({
			name: [reservation?.name ?? '', [Validators.required, Validators.maxLength(120)]],
			room: [reservation?.room ?? '', Validators.required],
			startTime: [
				UtilFunction.formatToLocalDateTimeString(reservation?.startTime ?? data.startTime),
				Validators.required,
			],
			endTime: [
				UtilFunction.formatToLocalDateTimeString(reservation?.endTime ?? data.endTime),
				Validators.required,
			],
			reservedBy: [
				{ value: reservation?.reservedBy ?? this.loggedUser().username, disabled: true },
				Validators.required,
			],
			eventType: [reservation?.eventType, Validators.required],
			note: [reservation?.note ?? ''],
		});

		if (this.isEditMode) {
			this.form.addControl('reviewedBy', this.formBuilder.control({value: reservation?.reviewedBy, disabled: true}, Validators.required));
		}
	}

	onSubmit(): void {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}

		this.submitting = true;

		const v = this.form.getRawValue();

		const request: ReservationRequest | Reservation = {
			... this.reservation,
			name: v.name,
			roomCode: v.room,
			eventType: v.eventType,
			startTime: UtilFunction.toLocalDateTime(v.startTime),
			endTime: UtilFunction.toLocalDateTime(v.endTime),
			reservedBy: v.reservedBy,
			note: v.note || undefined,
		};

		if (this.isEditMode) {
			this.store.dispatch(AppAction.updateReservation({reservation: request as unknown as Reservation}));
		} else {
			this.store.dispatch(AppAction.requestReservation({ request }));
		}

		this.ref.close();
	}

	onCancel(): void {
		this.ref.close(null);
	}

	protected readonly ReservationStatus = ReservationStatus;
}
