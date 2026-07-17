import { Injectable } from '@angular/core';
import { RequestDialogData, RequestReservationModalComponent, } from '../component/modal/request-reservation-modal/request-reservation-modal.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TranslateService } from '@ngx-translate/core';
import { EmployeeSettingsModalComponent, EmployeeSettingsModalData, } from '../component/modal/employee-settings-modal/employee-settings-modal.component';
import { Store } from '@ngrx/store';
import * as AppAction from '../store/app.action';
import { take } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ModalService {

	constructor(
		private store: Store,
		private dialogService: DialogService,
		private translateService: TranslateService,
	) {}

	openReservationPreviewModal(data: RequestDialogData = {}): DynamicDialogRef {
		const dialogRef = this.dialogService.open(RequestReservationModalComponent, {
			header: this.translateService.instant('reservation.preview'),
			closable: true,
			dismissableMask: true,
			draggable: false,
			style: { width: '40vw' },
			data,
		});

		dialogRef.onClose
			.pipe(take(1))
			.subscribe(() => {this.store.dispatch(AppAction.clearReservation());});

		return dialogRef;
	}

	openEmployeeSettingsDialog(data?: EmployeeSettingsModalData): DynamicDialogRef {
		const isEditMode: boolean = !!data;

		const dialogRef = this.dialogService.open(EmployeeSettingsModalComponent, {
			header: this.translateService.instant(isEditMode ? 'modal.edit-employee.title' : 'modal.add-employee.title'),
			closable: true,
			dismissableMask: true,
			draggable: false,
			style: { width: '40vw' },
			data,
		});

		dialogRef.onClose
			.pipe(take(1))
			.subscribe(() => {this.store.dispatch(AppAction.clearUser());});

		return dialogRef;
	}
}