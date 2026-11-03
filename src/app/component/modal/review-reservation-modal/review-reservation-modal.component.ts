import { Component, computed, DestroyRef, effect, Signal, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, Validators } from '@angular/forms';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { COMMON_MODULES } from '../../../modules/common.module';
import { PRIMENG_MODULES } from '../../../modules/ui.module';
import { Reservation, ReservationReview, ReservationStatus } from '../../../model/reservation.model';
import { Room } from '../../../model/room.model';
import { Severity } from '../../../model/ui.model';
import * as AppAction from '../../../store/app.action';
import * as AppSelector from '../../../store/app.selector';
import { formatDuration } from '../../../util/util-functions';

export interface ReviewDialogData {
	reservation: Reservation;
}

type ReviewDecision = ReservationStatus.ACCEPTED | ReservationStatus.REJECTED;

@Component({
	selector: 'app-review-reservation-modal',
	imports: [COMMON_MODULES, PRIMENG_MODULES],
	templateUrl: './review-reservation-modal.component.html',
	styleUrl: './review-reservation-modal.component.scss',
})
export class ReviewReservationModalComponent {
	readonly MAX_COMMENT_LENGTH = 500;
	readonly ReservationStatus = ReservationStatus;

	readonly reservation: Reservation;
	readonly startTime: Date;
	readonly endTime: Date;
	readonly isSameDay: boolean;
	readonly duration: string;

	readonly rooms: Signal<Room[]>;
	readonly roomName: Signal<string>;

	readonly decision: WritableSignal<ReviewDecision | null> = signal(null);
	readonly submitting: WritableSignal<boolean> = signal(false);

	readonly commentControl = new FormControl<string>('', {
		nonNullable: true,
		validators: [Validators.maxLength(this.MAX_COMMENT_LENGTH)],
	});
	private readonly comment: Signal<string> = toSignal(this.commentControl.valueChanges, {
		initialValue: '',
	});
	readonly commentLength: Signal<number> = computed(() => this.comment().length);

	readonly confirmSeverity: Signal<Severity> = computed(() =>
		this.decision() === ReservationStatus.REJECTED ? Severity.DANGER : Severity.SUCCESS,
	);
	readonly confirmIcon: Signal<string> = computed(() =>
		this.decision() === ReservationStatus.REJECTED ? 'pi pi-times' : 'pi pi-check',
	);
	readonly confirmLabel: Signal<string> = computed(() => {
		switch (this.decision()) {
			case ReservationStatus.ACCEPTED:
				return 'modal.review-reservation.confirm-approve';
			case ReservationStatus.REJECTED:
				return 'modal.review-reservation.confirm-reject';
			default:
				return 'modal.review-reservation.confirm';
		}
	});

	constructor(
		private store: Store,
		private actions$: Actions,
		private ref: DynamicDialogRef,
		private config: DynamicDialogConfig<ReviewDialogData>,
		private destroyRef: DestroyRef,
	) {
		this.reservation = this.config.data.reservation;
		this.startTime = new Date(this.reservation.startTime);
		this.endTime = new Date(this.reservation.endTime);
		this.isSameDay = this.startTime.toDateString() === this.endTime.toDateString();
		this.duration = formatDuration(this.startTime, this.endTime);

		this.rooms = this.store.selectSignal(AppSelector.selectRooms);
		this.roomName = computed(
			() => this.rooms()?.find((room: Room) => room.code === this.reservation.room)?.name ?? this.reservation.room,
		);

		effect(() => {
			if (!this.rooms()?.length) this.store.dispatch(AppAction.getRooms());
		});
	}

	selectDecision(decision: ReviewDecision): void {
		if (this.submitting()) return;
		this.decision.set(decision);
	}

	onConfirm(): void {
		const status: ReviewDecision | null = this.decision();
		if (!status || this.commentControl.invalid || this.submitting()) return;

		const review: ReservationReview = {
			uuid: this.reservation.uuid,
			status,
			comment: this.commentControl.value.trim() || undefined,
		};

		this.submitting.set(true);
		this.actions$
			.pipe(
				ofType(AppAction.reviewReservationSuccess, AppAction.reservationFailure),
				take(1),
				takeUntilDestroyed(this.destroyRef),
			)
			.subscribe((action) => {
				this.submitting.set(false);
				if (action.type === AppAction.reviewReservationSuccess.type) this.ref.close(true);
			});

		this.store.dispatch(AppAction.reviewReservation({ review }));
	}

	onCancel(): void {
		this.ref.close();
	}
}
