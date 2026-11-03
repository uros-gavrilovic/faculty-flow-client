import { Injectable } from '@angular/core';
import { RequestDialogData, RequestReservationModalComponent, } from '../component/modal/request-reservation-modal/request-reservation-modal.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TranslateService } from '@ngx-translate/core';
import { EmployeeSettingsModalComponent, EmployeeSettingsModalData, } from '../component/modal/employee-settings-modal/employee-settings-modal.component';
import { Store } from '@ngrx/store';
import * as AppAction from '../store/app.action';
import { take } from 'rxjs';
import {
	RoomDialogData,
	RoomModalComponent,
} from '../component/modal/room-modal/room-modal.component';
import {
	ReviewDialogData,
	ReviewReservationModalComponent,
} from '../component/modal/review-reservation-modal/review-reservation-modal.component';
import { Reservation } from '../model/reservation.model';

export interface ReservationPreviewResult {
	review?: Reservation;
}

@Injectable({ providedIn: 'root' })
export class ModalService {
	constructor(
		private store: Store,
		private dialogService: DialogService,
		private translateService: TranslateService,
	) {}

	openReservationPreviewModal(data: RequestDialogData = {}): DynamicDialogRef {
		const dialogRef = this.dialogService.open(RequestReservationModalComponent, {
			header: this.translateService.instant(
				data.reservation?.uuid ? 'reservation.preview' : 'modal.reservation-preview.title-create',
			),
			closable: true,
			dismissableMask: true,
			draggable: false,
			style: { width: '40vw', minWidth: '600px' },
			breakpoints: { '960px': '90vw' },
			data,
		});

		dialogRef.onClose
			.pipe(take(1))
			.subscribe((result?: ReservationPreviewResult | boolean) => {
				this.store.dispatch(AppAction.clearReservation());

				if (typeof result === 'object' && result?.review) {
					this.openReviewReservationModal(result.review);
				}
			});

		return dialogRef;
	}

	openReviewReservationModal(reservation: Reservation): DynamicDialogRef<ReviewReservationModalComponent> {
		const data: ReviewDialogData = { reservation };

		return this.dialogService.open(ReviewReservationModalComponent, {
			header: this.translateService.instant('modal.review-reservation.title'),
			closable: true,
			dismissableMask: true,
			draggable: false,
			style: { width: '40vw', minWidth: '520px' },
			breakpoints: { '960px': '90vw' },
			data,
		});
	}

	openEmployeeSettingsDialog(data?: EmployeeSettingsModalData): DynamicDialogRef {
		const isEditMode: boolean = !!data;

		const dialogRef = this.dialogService.open(EmployeeSettingsModalComponent, {
			header: this.translateService.instant(isEditMode ? 'modal.edit-employee.title' : 'modal.add-employee.title'),
			closable: true,
			dismissableMask: true,
			draggable: false,
			style: { width: '40vw', minWidth: '560px' },
			breakpoints: { '960px': '90vw' },
			data,
		});

		dialogRef.onClose
			.pipe(take(1))
			.subscribe(() => {this.store.dispatch(AppAction.clearUser());});

		return dialogRef;
	}

	openRoomModal(data?: RoomDialogData): DynamicDialogRef<RoomModalComponent> {

		const dialogRef = this.dialogService.open(RoomModalComponent, {
			header: this.translateService.instant(data?.room?.uuid ? 'modal.room.edit' : 'modal.room.create',),
			closable: true,
			dismissableMask: true,
			draggable: false,
			style: { width: '40vw', minWidth: '560px' },
			breakpoints: { '960px': '90vw' },
			data,
		});

		dialogRef.onClose
			.pipe(take(1))
			.subscribe(() => {this.store.dispatch(AppAction.clearRoom());});

		return dialogRef;
	}
}