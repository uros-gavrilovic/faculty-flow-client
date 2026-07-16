import { Component, OnInit } from '@angular/core';
import { UserTableComponent } from '../../component/user/user-table/user-table.component';
import { PRIMENG_MODULES } from '../../modules/ui.module';
import { TranslatePipe } from '@ngx-translate/core';
import { ModalService } from '../../service/modal.service';

@Component({
	selector: 'app-employees-page',
	imports: [UserTableComponent, PRIMENG_MODULES, TranslatePipe],
	templateUrl: './employees-page.component.html',
	styleUrl: './employees-page.component.scss',
})
export class EmployeesPageComponent implements OnInit {

	constructor(
		private modalService: ModalService,
	) {}

	ngOnInit() {

	}

	protected onAddEmployee() {
		this.modalService.openEmployeeSettingsDialog();
	}
}
