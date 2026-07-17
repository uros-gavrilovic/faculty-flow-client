import { Injectable } from '@angular/core';
import { RequestDialogData, RequestReservationModalComponent, } from '../component/modal/request-reservation-modal/request-reservation-modal.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TranslateService } from '@ngx-translate/core';
import { EmployeeSettingsModalComponent, EmployeeSettingsModalData, } from '../component/modal/employee-settings-modal/employee-settings-modal.component';
import { Reservation } from '../model/reservation.model';

@Injectable({ providedIn: 'root' })
export class ModalService {
	private dialogRef: DynamicDialogRef;

	constructor(
		private dialogService: DialogService,
		private translateService: TranslateService,
	) {}

	openReservationPreviewModal(data: RequestDialogData = {}): DynamicDialogRef {
		this.dialogRef = this.dialogService.open(RequestReservationModalComponent, {
			header: this.translateService.instant('reservation.preview'),
			closable: true,
			dismissableMask: true,
			draggable: false,
			style: { width: '40vw' },
			data,
		});
		return this.dialogRef;
	}

	openEmployeeSettingsDialog(data?: EmployeeSettingsModalData): DynamicDialogRef {
		const isEditMode: boolean = !!data;

		this.dialogRef = this.dialogService.open(EmployeeSettingsModalComponent, {
			header: this.translateService.instant(
				isEditMode ? 'modal.edit-employee.title' : 'modal.add-employee.title',
			),
			closable: true,
			dismissableMask: true,
			draggable: false,
			style: { width: '40vw' },
			data,
		});
		return this.dialogRef;
	}
}