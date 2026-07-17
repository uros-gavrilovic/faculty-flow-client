import { Component, OnInit, Signal, signal, ViewChild, WritableSignal } from '@angular/core';
import { ReservationTableComponent } from '../../component/reservation/reservation-table/reservation-table.component';
import { PRIMENG_MODULES } from '../../modules/ui.module';
import { COMMON_MODULES } from '../../modules/common.module';
import { PageHeaderComponent } from '../../component/misc/page-header/page-header.component';
import { Reservation } from '../../model/reservation.model';
import { User, UserRole } from '../../model/user.model';
import * as AppSelector from '../../store/app.selector';
import { Store } from '@ngrx/store';
import { Severity } from '../../model/ui.model';

@Component({
	selector: 'app-reservations-page',
	imports: [PRIMENG_MODULES, COMMON_MODULES, ReservationTableComponent, PageHeaderComponent],
	templateUrl: './reservations-page.component.html',
	styleUrl: './reservations-page.component.scss',
})
export class ReservationsPageComponent implements OnInit {

	currentUser: Signal<User>;
	selectedReservations: WritableSignal<Reservation[]> = signal<Reservation[]>([]);
	isFilterVisible: WritableSignal<boolean> = signal<boolean>(true);

	@ViewChild(ReservationTableComponent) table!: ReservationTableComponent;

	constructor(private store: Store) {}

	ngOnInit(): void {
		this.currentUser = this.store.selectSignal(AppSelector.selectCurrentUser);
	}

	onToggleFilter(): void {
		this.isFilterVisible.set(!this.isFilterVisible());
	}

	onApproveEvent(): void {
		this.table.approveSelected();
	}

	onRejectEvent(): void {
		this.table.rejectSelected();
	}

	get hasSelection(): boolean {
		return this.selectedReservations().length > 0;
	}

	get isAdmin(): boolean {
		return this.currentUser()?.roles.includes(UserRole.ADMINISTRATOR) ?? false;
	}

	protected readonly Severity = Severity;
}
