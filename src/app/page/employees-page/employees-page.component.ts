import { Component } from '@angular/core';
import { UserTableComponent } from '../../component/user/user-table/user-table.component';
import { PRIMENG_MODULES } from '../../modules/ui.module';

@Component({
	selector: 'app-employees-page',
	imports: [UserTableComponent, PRIMENG_MODULES],
	templateUrl: './employees-page.component.html',
	styleUrl: './employees-page.component.scss',
})
export class EmployeesPageComponent {}
