import { Component, computed, DestroyRef, effect, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Actions, ofType } from '@ngrx/effects';
import { Action, ActionCreator, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { map, take } from 'rxjs';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EventType, Reservation, ReservationRequest, ReservationStatus } from '../../../model/reservation.model';
import { PRIMENG_MODULES } from '../../../modules/ui.module';
import { COMMON_MODULES } from '../../../modules/common.module';
import { Room } from '../../../model/room.model';
import { User, UserRole } from '../../../model/user.model';
import { Severity } from '../../../model/ui.model';
import * as AppAction from '../../../store/app.action';
import * as AppSelector from '../../../store/app.selector';
import * as UtilFunction from '../../../util/util-functions';
import { EVENT_TYPE_ICONS, ROOM_TYPE_ICONS } from '../../../constant/icon.constant';
import { reservationStatusSeverityMap } from '../../../constant/severity.constant';
import { ReservationPreviewResult } from '../../../service/modal.service';

export interface RequestDialogData {
	startTime?: Date;
	endTime?: Date;
	reservation?: Partial<Reservation>;
	onCloseCallback?: () => void;
}

interface ReservationFormValue {
	name?: string | null;
	room?: string | null;
	startTime?: Date | null;
	endTime?: Date | null;
	reservedBy?: string | null;
	eventType?: EventType | null;
	note?: string | null;
}

type LockReason = 'status' | 'permission';

const endAfterStartValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
	const start = group.get('startTime')?.value;
	const end = group.get('endTime')?.value;

	if (!start || !end) return null;
	return new Date(end).getTime() <= new Date(start).getTime() ? { endBeforeStart: true } : null;
};

@Component({
	selector: 'app-request-reservation-modal',
	imports: [COMMON_MODULES, PRIMENG_MODULES],
	templateUrl: './request-reservation-modal.component.html',
	styleUrl: './request-reservation-modal.component.scss',
})
export class RequestReservationModalComponent implements OnInit {
	readonly form: FormGroup;
	readonly isEditMode: boolean;
	readonly isReadOnly: WritableSignal<boolean> = signal(false);
	readonly lockReason: WritableSignal<LockReason | null> = signal(null);
	readonly submitting: WritableSignal<boolean> = signal(false);
	private initialDataLoaded = false;

	readonly reservation: Signal<Reservation>;
	readonly rooms: Signal<Room[]>;
	readonly loggedUser: Signal<User>;

	readonly eventTypes: EventType[] = Object.values(EventType);
	readonly eventTypeIcons = EVENT_TYPE_ICONS;
	readonly roomTypeIcons = ROOM_TYPE_ICONS;

	private readonly formValue: Signal<ReservationFormValue>;

	readonly displayName: Signal<string> = computed(() => this.formValue().name?.trim() ?? '');
	readonly eventType: Signal<EventType | null> = computed(() => this.formValue().eventType ?? null);
	readonly requestedBy: Signal<string> = computed(() => this.formValue().reservedBy ?? '');
	readonly startTime: Signal<Date | null> = computed(() => this.toDate(this.formValue().startTime));
	readonly endTime: Signal<Date | null> = computed(() => this.toDate(this.formValue().endTime));
	readonly selectedRoom: Signal<Room | null> = computed(() => {
		const code: string | null | undefined = this.formValue().room;
		return code ? (this.rooms()?.find((room: Room) => room.code === code) ?? null) : null;
	});
	readonly isSameDay: Signal<boolean> = computed(() => {
		const start: Date | null = this.startTime();
		const end: Date | null = this.endTime();
		return !start || !end || start.toDateString() === end.toDateString();
	});
	readonly duration: Signal<string | null> = computed(() => {
		const start: Date | null = this.startTime();
		const end: Date | null = this.endTime();
		return start && end && end > start ? UtilFunction.formatDuration(start, end) : null;
	});
	readonly summaryIcon: Signal<string> = computed(() => {
		const type: EventType | null = this.eventType();
		return type ? EVENT_TYPE_ICONS[type] : 'pi pi-calendar-plus';
	});
	readonly statusSeverity: Signal<Severity> = computed(() => {
		const status: ReservationStatus | undefined = this.reservation()?.status;
		return status ? reservationStatusSeverityMap[status] : Severity.SECONDARY;
	});
	readonly lockMessage: Signal<string | null> = computed(() => {
		switch (this.lockReason()) {
			case 'status': {
				const status: string = this.translateService.instant(
					`enum.reservation.status.${this.reservation()?.status?.toLowerCase()}`,
				);
				return this.translateService.instant('modal.reservation-preview.locked-status', {
					status: status.toLowerCase(),
				});
			}
			case 'permission':
				return this.translateService.instant('modal.reservation-preview.locked-permission');
			default:
				return null;
		}
	});

	constructor(
		private store: Store,
		private formBuilder: FormBuilder,
		private ref: DynamicDialogRef,
		private config: DynamicDialogConfig<RequestDialogData>,
		private actions$: Actions,
		private translateService: TranslateService,
		private destroyRef: DestroyRef,
	) {
		this.reservation = this.store.selectSignal(AppSelector.selectReservation);
		this.loggedUser = this.store.selectSignal(AppSelector.selectCurrentUser);
		this.rooms = this.store.selectSignal(AppSelector.selectRooms);

		this.isEditMode = !!this.config.data.reservation?.uuid;
		this.isReadOnly.set(this.isEditMode);

		const data: RequestDialogData = this.config.data;
		this.form = this.formBuilder.group(
			{
				name: ['', [Validators.required, Validators.maxLength(120)]],
				room: ['', Validators.required],
				startTime: [data.startTime ?? null, Validators.required],
				endTime: [data.endTime ?? null, Validators.required],
				reservedBy: [{ value: this.loggedUser()?.username, disabled: true }, Validators.required],
				eventType: [null, Validators.required],
				note: [''],
			},
			{ validators: endAfterStartValidator },
		);
		this.formValue = toSignal(this.form.valueChanges.pipe(map(() => this.form.getRawValue())), {
			initialValue: this.form.getRawValue(),
		});

		effect(() => {
			if (!this.rooms()?.length) this.store.dispatch(AppAction.getRooms());
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
			this.store.dispatch(AppAction.getReservation({ uuid: this.config.data.reservation?.uuid }));
		}
	}

	private updateReadOnlyState(reservation: Reservation): void {
		const user: User = this.loggedUser();
		const isAdmin: boolean = user?.roles?.includes(UserRole.ADMINISTRATOR) ?? false;
		const isOwner: boolean = user?.username === reservation?.reservedBy;
		const isLockedByStatus: boolean = reservation?.status !== ReservationStatus.PENDING;
		const isLockedByPermission: boolean = !isOwner && !isAdmin;

		this.lockReason.set(isLockedByStatus ? 'status' : isLockedByPermission ? 'permission' : null);
		this.isReadOnly.set(isLockedByStatus || isLockedByPermission);

		if (this.isReadOnly()) {
			this.form.get('startTime')?.disable();
			this.form.get('endTime')?.disable();
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
	}

	selectEventType(type: EventType): void {
		if (this.isReadOnly() || this.submitting()) return;
		this.form.get('eventType')?.setValue(type);
		this.form.get('eventType')?.markAsTouched();
	}

	onSubmit(): void {
		if (this.isReadOnly() || this.submitting()) return;

		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}

		const v = this.form.getRawValue();
		const formFields = {
			name: v.name.trim(),
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
				note: v.note?.trim() || null,
			};
			this.closeOnSuccess(AppAction.updateReservationSuccess);
			this.store.dispatch(AppAction.updateReservation({ reservation: updateReservationRequest }));
		} else {
			const reservationRequest: ReservationRequest = {
				...formFields,
				roomCode: v.room,
				note: v.note?.trim() || undefined,
			};
			this.closeOnSuccess(AppAction.requestReservationSuccess);
			this.store.dispatch(AppAction.requestReservation({ request: reservationRequest }));
		}
	}

	onReview(): void {
		const result: ReservationPreviewResult = { review: this.reservation() };
		this.ref.close(result);
	}

	onClose(): void {
		this.ref.close(true);
	}

	canReview(): boolean {
		return (
			this.isEditMode &&
			(this.loggedUser()?.roles?.includes(UserRole.ADMINISTRATOR) ?? false) &&
			this.reservation()?.status === ReservationStatus.PENDING
		);
	}

	private closeOnSuccess(successAction: ActionCreator<string, () => Action>): void {
		this.submitting.set(true);

		this.actions$
			.pipe(ofType(successAction, AppAction.reservationFailure), take(1), takeUntilDestroyed(this.destroyRef))
			.subscribe((action) => {
				this.submitting.set(false);
				if (action.type === successAction.type) this.onClose();
			});
	}

	private toDate(value: Date | string | null | undefined): Date | null {
		if (!value) return null;
		const date: Date = value instanceof Date ? value : new Date(value);
		return isNaN(date.getTime()) ? null : date;
	}
}
