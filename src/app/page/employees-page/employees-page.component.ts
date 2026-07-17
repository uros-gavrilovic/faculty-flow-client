import { Component, OnInit } from '@angular/core';
import { UserTableComponent } from '../../component/user/user-table/user-table.component';
import { PRIMENG_MODULES } from '../../modules/ui.module';
import { TranslatePipe } from '@ngx-translate/core';
import { ModalService } from '../../service/modal.service';
import { PageHeaderComponent } from '../../component/misc/page-header/page-header.component';
import { ReservationTableComponent } from '../../component/reservation/reservation-table/reservation-table.component';

@Component({
	selector: 'app-employees-page',
	imports: [
		UserTableComponent,
		PRIMENG_MODULES,
		TranslatePipe,
		PageHeaderComponent,
		ReservationTableComponent,
	],
	templateUrl: './employees-page.component.html',
	styleUrl: './employees-page.component.scss',
})
export class EmployeesPageComponent implements OnInit {
	constructor(private modalService: ModalService) {}

	ngOnInit() {}

	protected onAddEmployee() {
		this.modalService.openEmployeeSettingsDialog();
	}
}
