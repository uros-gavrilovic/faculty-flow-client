import { Component, DestroyRef, effect, OnInit, Signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Actions, ofType } from '@ngrx/effects';
import { Action, ActionCreator } from '@ngrx/store';
import { take } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import {
	EventType,
	Reservation,
	ReservationRequest,
	ReservationReview,
	ReservationStatus,
} from '../../../model/reservation.model';
import { PRIMENG_MODULES } from '../../../modules/ui.module';
import { Store } from '@ngrx/store';
import * as AppAction from '../../../store/app.action';
import { COMMON_MODULES } from '../../../modules/common.module';
import { Room } from '../../../model/room.model';
import { User, UserRole } from '../../../model/user.model';
import * as UtilFunction from '../../../util/util-functions';
import { Severity } from '../../../model/ui.model';
import * as AppSelector from '../../../store/app.selector';

export interface RequestDialogData {
	startTime?: Date;
	endTime?: Date;
	reservation?: Partial<Reservation>;
	onCloseCallback?: () => void;
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
	initialDataLoaded: boolean = false;

	reservation: Signal<Reservation>;
	rooms: Signal<Room[]>;
	loggedUser: Signal<User>;

	readonly eventTypes: EventType[] = Object.values(EventType);
	readonly ReservationStatus = ReservationStatus;
	readonly Severity = Severity;

	constructor(
		private store: Store,
		private formBuilder: FormBuilder,
		private ref: DynamicDialogRef,
		private config: DynamicDialogConfig<RequestDialogData>,
		private actions$: Actions,
		private destroyRef: DestroyRef,
	) {
		this.reservation = this.store.selectSignal(AppSelector.selectReservation);
		this.loggedUser = this.store.selectSignal(AppSelector.selectCurrentUser);
		this.rooms = this.store.selectSignal(AppSelector.selectRooms);

		this.isEditMode = !!this.config.data.reservation?.uuid;
		this.isReadOnly = this.isEditMode;

		this.initForm();

		effect(() => {
			const availableRooms: Room[] = this.rooms();

			if (!availableRooms?.length) this.store.dispatch(AppAction.getRooms());
		});
		effect(() => {
			const reservation: Reservation = this.reservation();

			if (this.isEditMode && reservation && !this.initialDataLoaded) {
				this.initialDataLoaded = true;
				this.updateReadOnlyState(reservation);
				this.patchForm(reservation);
			}
		});
	}

	ngOnInit(): void {
		if (this.isEditMode) {
			this.store.dispatch(
				AppAction.getReservation({ uuid: this.config.data.reservation?.uuid }),
			);
		}
	}

	private updateReadOnlyState(reservation: Reservation): void {
		const user: User = this.loggedUser();
		const isAdmin: boolean = user.roles?.includes(UserRole.ADMINISTRATOR) ?? false;
		const isOwner: boolean = user.username === reservation?.reservedBy;
		const isLockedByStatus: boolean = reservation?.status !== ReservationStatus.PENDING;
		const isLockedByPermission: boolean = !isOwner && !isAdmin;

		this.isReadOnly = isLockedByStatus || isLockedByPermission;

		if (this.isReadOnly) {
			this.form.get('startTime')?.disable();
			this.form.get('endTime')?.disable();
		}
	}

	private initForm(): void {
		const data: RequestDialogData = this.config.data;

		this.form = this.formBuilder.group({
			name: ['', [Validators.required, Validators.maxLength(120)]],
			room: ['', Validators.required],
			startTime: [data.startTime ?? null, Validators.required],
			endTime: [data.endTime ?? null, Validators.required],
			reservedBy: [{ value: this.loggedUser()?.username, disabled: true }, Validators.required],
			eventType: [null, Validators.required],
			note: [''],
		});

		if (this.isEditMode) {
			this.form.addControl(
				'reviewedBy',
				this.formBuilder.control({ value: null, disabled: true }, Validators.required),
			);
		}
	}

	private patchForm(reservation: Reservation): void {
		this.form.patchValue({
			name: reservation.name,
			room: reservation.room,
			startTime: new Date(reservation.startTime),
			endTime: new Date(reservation.endTime),
			reservedBy: reservation.reservedBy,
			eventType: reservation.eventType,
			note: reservation.note ?? '',
		});

		this.form.get('reviewedBy')?.patchValue(reservation.reviewedBy);
	}

	onSubmit(): void {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}

		const v = this.form.getRawValue();
		const formFields = {
			name: v.name,
			eventType: v.eventType,
			startTime: UtilFunction.formatToLocalDateTimeString(v.startTime),
			endTime: UtilFunction.formatToLocalDateTimeString(v.endTime),
			reservedBy: v.reservedBy,
		};

		if (this.isEditMode) {
			const updateReservationRequest: Reservation = {
				...this.reservation(),
				...formFields,
				room: v.room,
				note: v.note || null,
			};
			this.closeOnSuccess(AppAction.updateReservationSuccess);
			this.store.dispatch(AppAction.updateReservation({ reservation: updateReservationRequest }));
		} else {
			const reservationRequest: ReservationRequest = {
				...formFields,
				roomCode: v.room,
				note: v.note || undefined,
			};
			this.closeOnSuccess(AppAction.requestReservationSuccess);
			this.store.dispatch(AppAction.requestReservation({ request: reservationRequest }));
		}
	}

	onApproveReservation(reservation: Reservation): void {
		const review: ReservationReview = {
			uuid: reservation.uuid,
			status: ReservationStatus.ACCEPTED,
		};

		this.closeOnSuccess(AppAction.reviewReservationSuccess);
		this.store.dispatch(AppAction.reviewReservation({ review }));
	}

	onRejectReservation(reservation: Reservation): void {
		const review: ReservationReview = {
			uuid: reservation.uuid,
			status: ReservationStatus.REJECTED,
		};

		this.closeOnSuccess(AppAction.reviewReservationSuccess);
		this.store.dispatch(AppAction.reviewReservation({ review }));
	}

	private closeOnSuccess(successAction: ActionCreator<string, () => Action>): void {
		this.submitting = true;

		this.actions$
			.pipe(
				ofType(successAction, AppAction.reservationFailure),
				take(1),
				takeUntilDestroyed(this.destroyRef),
			)
			.subscribe((action) => {
				this.submitting = false;
				if (action.type === successAction.type) this.onClose();
			});
	}

	onClose(): void {
		this.ref.close(true);
	}

	getIsUserAdmin(user: User): boolean {
		return user?.roles?.includes(UserRole.ADMINISTRATOR);
	}
}
