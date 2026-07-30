import { Component, signal, WritableSignal } from '@angular/core';
import { COMMON_MODULES } from '../../modules/common.module';
import { PRIMENG_MODULES } from '../../modules/ui.module';
import { PageHeaderComponent } from '../../component/misc/page-header/page-header.component';
import { Severity } from '../../model/ui.model';
import { RoomTableComponent } from '../../component/room/room-table/room-table.component';
import { ModalService } from '../../service/modal.service';

@Component({
	selector: 'app-rooms-page',
	imports: [COMMON_MODULES, PRIMENG_MODULES, PageHeaderComponent, RoomTableComponent],
	templateUrl: './rooms-page.component.html',
	styleUrl: './rooms-page.component.scss',
})
export class RoomsPageComponent {
	isFilterVisible: WritableSignal<boolean> = signal<boolean>(true);

	readonly Severity = Severity;

	constructor(
		private modalService: ModalService,
	) {}

	onToggleFilter(): void {
		this.isFilterVisible.set(!this.isFilterVisible());
	}

	onAddRoom(): void {
		this.modalService.openRoomModal();
	}
}
