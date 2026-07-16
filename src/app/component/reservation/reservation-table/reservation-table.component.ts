import { Component, Signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { TableLazyLoadEvent } from 'primeng/table';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
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
import { Tooltip } from 'primeng/tooltip';
import { User, UserRole } from '../../../model/user.model';
import { Severity } from '../../../model/ui.model';
import {reservationStatusSeverityMap} from '../../../constant/severity.constant';
import { COMMON_MODULES } from '../../../modules/common.module';

@Component({
	selector: 'app-reservation-table',
	imports: [PRIMENG_MODULES, COMMON_MODULES],
	templateUrl: './reservation-table.component.html',
	styleUrl: './reservation-table.component.scss',
})
export class ReservationTableComponent {

	selectedReservations: Reservation[] = [];
	searchRequest: SearchRequest<ReservationFilter>;

	currentUser: Signal<User>;
	reservations: Signal<SearchResponse<Reservation>>;

	protected readonly ReservationStatus = ReservationStatus;

	constructor(
		private store: Store,
		private translateService: TranslateService,
	) {}

	ngOnInit(): void {
		this.reservations = this.store.selectSignal(AppSelector.selectReservations);
		this.currentUser = this.store.selectSignal(AppSelector.selectCurrentUser);
		this.searchRequest = {
			page: 0,
			size: 10,
			filter: {
				reservedBy: this.currentUser()?.roles.includes(UserRole.ADMINISTRATOR) ?
					undefined :
					this.currentUser()?.username,
			}
		};
		this.store.dispatch(AppAction.searchReservations({searchRequest: this.searchRequest}));
	}

	onPage(event: TableLazyLoadEvent): void {
		const page: number = event.first / event.rows;
		const size: number = event.rows;
		this.searchRequest = {...this.searchRequest, page, size};

		this.store.dispatch(AppAction.searchReservations({ searchRequest: this.searchRequest }));
	}

	getStatusSeverity(status: ReservationStatus): Severity {
		return reservationStatusSeverityMap[status];
	}

	approveSelected(): void {
		this.selectedReservations.forEach((reservation: Reservation): void => {
			const review: ReservationReview = {
				uuid: reservation.uuid,
				status: ReservationStatus.ACCEPTED,
			};
			this.store.dispatch(AppAction.reviewReservation({ review }));
		});
		this.selectedReservations = [];
	}

	rejectSelected(): void {
		this.selectedReservations.forEach((reservation: Reservation): void => {
			const review: ReservationReview = {
				uuid: reservation.uuid,
				status: ReservationStatus.REJECTED,
			};
			this.store.dispatch(AppAction.reviewReservation({ review }));
		});
		this.selectedReservations = [];
	}

	get hasSelection(): boolean {
		return this.selectedReservations.length > 0;
	}

	get showingReservationsTemplate(): string {
		return this.translateService.instant('reservation.pagination');
	}

	get isAdmin(): boolean {
		return this.currentUser()?.roles.includes(UserRole.ADMINISTRATOR) ?? false;
	}
}