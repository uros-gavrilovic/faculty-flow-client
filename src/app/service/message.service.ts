import { Injectable } from '@angular/core';
import { MessageService as PrimeNgMessageService} from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { MessageSeverity } from '../model/message-severity.model';

@Injectable({
	providedIn: 'root',
})
export class MessageService {
	constructor(
		private translateService: TranslateService,
		private messageService: PrimeNgMessageService,
	) {}

	showMessage(severity: MessageSeverity, summary: string, detail?: string, icon?: string): void {
		this.messageService.add({
			severity: severity,
			summary: this.translateService.instant(summary),
			detail: detail ? this.translateService.instant(detail) : undefined,
		});
	}
}