import { Component, model, ModelSignal, Signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { TableLazyLoadEvent } from 'primeng/table';
import { TranslateService } from '@ngx-translate/core';
import { PRIMENG_MODULES } from '../../../modules/ui.module';
import {
	Reservation,
	ReservationFilter,
	ReservationReview,
	ReservationStatus,
} from '../../../model/reservation.model';
import { SearchRequest, SearchResponse } from '../../../model/search.model';
import * as AppSelector from '../../../store/app.selector';
import * as AppAction from '../../../store/app.action';
import { User, UserRole } from '../../../model/user.model';
import { Severity } from '../../../model/ui.model';
import {reservationStatusSeverityMap} from '../../../constant/severity.constant';
import { COMMON_MODULES } from '../../../modules/common.module';
import { ScheduleFilterComponent } from '../../schedule/schedule-filter/schedule-filter.component';
import { SortEvent } from 'primeng/api';
import { ModalService } from '../../../service/modal.service';

@Component({
	selector: 'app-reservation-table',
	imports: [PRIMENG_MODULES, COMMON_MODULES, ScheduleFilterComponent],
	templateUrl: './reservation-table.component.html',
	styleUrl: './reservation-table.component.scss',
})
export class ReservationTableComponent {
	searchRequest: SearchRequest<ReservationFilter>;
	currentUser: Signal<User>;
	reservations: Signal<SearchResponse<Reservation>>;
	selectedReservations: ModelSignal<Reservation[]> = model<Reservation[]>([]);
	isFilterVisible: ModelSignal<boolean> = model<boolean>();

	readonly ReservationStatus = ReservationStatus;

	constructor(
		private store: Store,
		private translateService: TranslateService,
		private modalService: ModalService,
	) {}

	ngOnInit(): void {
		this.reservations = this.store.selectSignal(AppSelector.selectReservations);
		this.currentUser = this.store.selectSignal(AppSelector.selectCurrentUser);

		this.searchRequest = {
			page: 0,
			size: 10,
			filter: {
				reservedBy: this.currentUser()?.roles.includes(UserRole.ADMINISTRATOR)
					? undefined
					: this.currentUser()?.username,
			},
		};
		this.store.dispatch(AppAction.searchReservations({ searchRequest: this.searchRequest }));
	}

	onPage(event: TableLazyLoadEvent): void {
		const page: number = event.first / event.rows;
		const size: number = event.rows;
		this.searchRequest = { ...this.searchRequest, page, size };

		this.store.dispatch(AppAction.searchReservations({ searchRequest: this.searchRequest }));
	}

	onSort(event: SortEvent): void {
		this.searchRequest = {
			...this.searchRequest,
			page: 0,
			sortBy: event.field,
			direction: event.order === 1 ? 'ASC' : 'DESC',
		};

		this.store.dispatch(AppAction.searchReservations({ searchRequest: this.searchRequest }));
	}

	getStatusSeverity(status: ReservationStatus): Severity {
		return reservationStatusSeverityMap[status];
	}

	approveSelected(): void {
		this.selectedReservations().forEach((reservation: Reservation): void => {
			const review: ReservationReview = {
				uuid: reservation.uuid,
				status: ReservationStatus.ACCEPTED,
			};
			this.store.dispatch(AppAction.reviewReservation({ review }));
		});
		this.selectedReservations.set([]);
	}

	rejectSelected(): void {
		this.selectedReservations().forEach((reservation: Reservation): void => {
			const review: ReservationReview = {
				uuid: reservation.uuid,
				status: ReservationStatus.REJECTED,
			};
			this.store.dispatch(AppAction.reviewReservation({ review }));
		});
		this.selectedReservations.set([]);
	}

	get showingReservationsTemplate(): string {
		return this.translateService.instant('reservation.pagination');
	}

	get isAdmin(): boolean {
		return this.currentUser()?.roles.includes(UserRole.ADMINISTRATOR) ?? false;
	}

	onFilterChange(filter: ReservationFilter): void {
		this.searchRequest = { ...this.searchRequest, filter };
		this.store.dispatch(AppAction.searchReservations({ searchRequest: this.searchRequest }));
	}

	onSelectionChange(selected: Reservation[]): void {
		this.selectedReservations.set(
			selected.filter((reservation) => reservation.status === ReservationStatus.PENDING),
		);
	}

	onToggleSelectAll(checked: boolean): void {
		if (checked) {
			this.selectedReservations.set([...this.pendingReservations]);
		} else {
			this.selectedReservations.set([]);
		}
	}

	get pendingReservations(): Reservation[] {
		return (this.reservations()?.data ?? []).filter(
			(r) => r.status === ReservationStatus.PENDING,
		);
	}

	get allPendingSelected(): boolean {
		return (
			this.pendingReservations.length > 0 &&
			this.pendingReservations.every((r) =>
				this.selectedReservations().some((s) => s.uuid === r.uuid),
			)
		);
	}

	protected onReservationSelect(reservation: Reservation): void {
		this.modalService.openReservationPreviewModal({reservation})
	}
}