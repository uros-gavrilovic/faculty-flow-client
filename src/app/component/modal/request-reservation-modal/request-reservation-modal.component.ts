import { Component, effect, OnInit, Signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ReservationRequest } from '../../../model/reservation.model';
import { PRIMENG_MODULES } from '../../../modules/ui.module';
import { Store } from '@ngrx/store';
import * as AppAction from '../../../store/app.action';
import { COMMON_MODULES } from '../../../modules/common.module';
import { selectCurrentUser, selectRooms } from '../../../store/app.selector';
import { Room } from '../../../model/room.model';
import { User } from '../../../model/user.model';
import * as UtilFunction from '../../../util/util-functions';

export interface RequestDialogData {
	startTime?: Date;
	endTime?: Date;
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

	rooms: Signal<Room[]>;
	loggedUser: Signal<User>;

	constructor(
		private store: Store,
		private ref: DynamicDialogRef,
		private formBuilder: FormBuilder,
		private config: DynamicDialogConfig<RequestDialogData>,
	) {
		this.initDispatch();
	}

	ngOnInit(): void {
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

		this.form = this.formBuilder.group({
			name: ['', [Validators.required, Validators.maxLength(120)]],
			room: ['', Validators.required],
			startTime: [UtilFunction.formatToLocalDateTimeString(data.startTime), Validators.required],
			endTime: [UtilFunction.formatToLocalDateTimeString(data.endTime), Validators.required],
			reservedBy: [{ value: this.loggedUser().username, disabled: true }, Validators.required],
			note: [''],
		});
	}

	onSubmit(): void {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}

		this.submitting = true;

		const v = this.form.value;

		const request: ReservationRequest = {
			name: v.name,
			roomCode: v.room,
			startTime: UtilFunction.toLocalDateTime(v.startTime),
			endTime: UtilFunction.toLocalDateTime(v.endTime),
			reservedBy: v.reservedBy,
			note: v.note || undefined,
		};

		this.store.dispatch(AppAction.requestReservation({ request }));
		this.ref.close();
	}

	onCancel(): void {
		this.ref.close(null);
	}
}