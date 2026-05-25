import { Injectable } from '@angular/core';
import {
	RequestDialogData,
	RequestReservationModalComponent,
} from '../component/modal/request-reservation-modal/request-reservation-modal.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class ModalService {

	private dialogRef: DynamicDialogRef;

	constructor(
		private dialogService: DialogService,
		private translateService: TranslateService,
	) {}

	openRequestReservationDialog(data: RequestDialogData = {}): void {
		this.dialogRef = this.dialogService.open(RequestReservationModalComponent, {
			header: this.translateService.instant('modal.request-reservation.title'),
			closable: true,
			draggable: false,
			style: { width: '90vw', maxWidth: '30vw' },
			data,
		});
	}
}