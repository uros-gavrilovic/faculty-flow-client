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
import { EmployeeSettingsModalComponent } from '../../modal/employee-settings-modal/employee-settings-modal.component';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Severity } from '../../../model/ui.model';
import { getAccountVerifiedSeverity, getAvatarSeverity, roleTagSeverityMap} from '../../../constant/severity.constant';

@Component({
	selector: 'app-user-table',
	standalone: true,
	imports: [PRIMENG_MODULES, TranslatePipe],
	templateUrl: './user-table.component.html',
	styleUrl: './user-table.component.scss',
})
export class UserTableComponent implements OnInit {

	users: Signal<SearchResponse<User>>;

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
			.subscribe(() => this.router.navigate(['/employees']));
	}

	loadUsers(page: number, size: number): void {
		const searchRequest: SearchRequest = { page, size };
		this.store.dispatch(AppAction.searchUsers({ searchRequest }));
	}

	onPage(event: TableLazyLoadEvent): void {
		this.loadUsers(
			event.first / event.rows,
			event.rows
		);
	}

	onEditEmployee(user: User): void {
		this.router.navigate(['/employees'], { queryParams: { uuid: user.uuid } });
	}

	getUserInitials(user: User): string {
		return `${user.firstName?.[0]}${user.lastName?.[0]}`;
	}

	getRoleSeverity(role: UserRole): Severity {
		return roleTagSeverityMap[role];
	}

	getAvatarSeverity(user: User): string {
		return getAvatarSeverity(user);
	}

	protected readonly getAccountVerifiedSeverity = getAccountVerifiedSeverity;
}
