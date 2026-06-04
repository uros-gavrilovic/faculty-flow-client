import { Component, DestroyRef, OnInit, Signal } from '@angular/core';
import * as AppSelector from '../../../store/app.selector';
import * as AppAction from '../../../store/app.action';
import { PRIMENG_MODULES } from '../../../modules/ui.module';
import { User, UserRole } from '../../../model/user.model';
import { Store } from '@ngrx/store';
import { SearchRequest, SearchResponse } from '../../../model/search.model';
import { TableLazyLoadEvent } from 'primeng/table';
import { TranslatePipe } from '@ngx-translate/core';
import { ModalService } from '../../../service/modal.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EmployeeSettingsModalComponent, EmployeeSettingsModalData, } from '../../modal/employee-settings-modal/employee-settings-modal.component';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
	selector: 'app-user-table',
	standalone: true,
	imports: [PRIMENG_MODULES, TranslatePipe],
	templateUrl: './user-table.component.html',
	styleUrl: './user-table.component.scss',
})
export class UserTableComponent implements OnInit {

	users: Signal<SearchResponse<User>>;

	readonly roleTagSeverityMap: Record<UserRole, 'danger' | 'secondary'> = {
		[UserRole.ADMINISTRATOR]: 'danger',
		[UserRole.USER]: 'secondary',
	};

	constructor(
		private store: Store,
		private route: ActivatedRoute,
		private router: Router,
		private modalService: ModalService,
		private destroyRef: DestroyRef,
	) {}

	ngOnInit(): void {
		this.route.queryParamMap
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe((params: ParamMap): void => this.onRouteChange(params));

		this.store.dispatch(AppAction.searchUsers({ searchRequest: { page: 0, size: 10 } }));
		this.users = this.store.selectSignal(AppSelector.selectUsers);
	}

	private onRouteChange(params: ParamMap): void {
		const uuid: string = params.get('uuid');
		if (!uuid) return;

		const modalRef: DynamicDialogRef<EmployeeSettingsModalComponent> = this.modalService.openEmployeeSettingsDialog({ uuid });
		modalRef.onClose
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe(() => {
			this.router.navigate(['/employees']);
		});

		this.modalService.openEmployeeSettingsDialog({ uuid } as EmployeeSettingsModalData);
	}

	loadUsers(page: number, size: number): void {
		const searchRequest: SearchRequest = { page, size };
		this.store.dispatch(AppAction.searchUsers({ searchRequest }));
	}

	onPage(event: TableLazyLoadEvent): void {
		const page: number = event.first / event.rows;
		const size: number = event.rows;
		this.loadUsers(page, size);
	}

	getRoleSeverity(role: UserRole): 'danger' | 'secondary' {
		return this.roleTagSeverityMap[role];
	}

	onEditEmployee(user: User): void {
		this.router.navigate(['/employees'], { queryParams: { uuid: user.uuid } });
	}
}
