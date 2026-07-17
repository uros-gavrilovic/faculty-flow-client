import { Component } from '@angular/core';
import { UserTableComponent } from '../../component/user/user-table/user-table.component';
import { PRIMENG_MODULES } from '../../modules/ui.module';
import { ModalService } from '../../service/modal.service';
import { PageHeaderComponent } from '../../component/misc/page-header/page-header.component';
import { COMMON_MODULES } from '../../modules/common.module';

@Component({
	selector: 'app-employees-page',
	imports: [COMMON_MODULES, PRIMENG_MODULES, UserTableComponent, PageHeaderComponent],
	templateUrl: './employees-page.component.html',
	styleUrl: './employees-page.component.scss',
})
export class EmployeesPageComponent {

	constructor(
		private modalService: ModalService
	) {}

	protected onAddEmployee(): void {
		this.modalService.openEmployeeSettingsDialog();
	}
}
