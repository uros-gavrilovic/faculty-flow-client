import { Component, DestroyRef, effect, OnInit, Signal, ViewChild } from '@angular/core';
import {
	ActionEventArgs,
	AgendaService,
	CellClickEventArgs,
	DayService,
	EventClickArgs,
	EventSettingsModel,
	MonthAgendaService,
	MonthService,
	PopupOpenEventArgs,
	ScheduleComponent,
	ScheduleModule,
	TimelineMonthService,
	TimelineViewsService,
	TimelineYearService,
	WeekService,
	WorkWeekService,
} from '@syncfusion/ej2-angular-schedule';
import { Reservation, ReservationStatus } from '../../model/reservation.model';
import { ConfirmationService } from 'primeng/api';
import { ModalService } from '../../service/modal.service';
import { selectReservations } from '../../store/app.selector';
import { Store } from '@ngrx/store';
import * as AppAction from '../../store/app.action';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {ScheduleEvent} from '../../model/scheduler.model';

@Component({
	selector: 'app-schedule-page',
	imports: [ScheduleModule],
	providers: [
		DayService,
		WeekService,
		WorkWeekService,
		MonthService,
		AgendaService,
		MonthAgendaService,
		TimelineViewsService,
		TimelineMonthService,
		TimelineYearService,
	],
	templateUrl: './schedule-page.component.html',
	styleUrl: './schedule-page.component.scss',
})
export class SchedulePageComponent implements OnInit {
	eventSettings: EventSettingsModel;

	@ViewChild('scheduleObj') scheduleObj!: ScheduleComponent;

	reservations: Signal<Reservation[]>;

	constructor(
		private store: Store,
		private modalService: ModalService,
		private confirmationService: ConfirmationService,
		private destroyRef: DestroyRef,
	) {}

	ngOnInit(): void {
		this.eventSettings = {
			dataSource: [],
			fields: {
				id: 'Id',
				subject: { name: 'Subject' },
				startTime: { name: 'StartTime' },
				endTime: { name: 'EndTime' },
				description: { name: 'Note' },
				isReadonly: 'IsReadonly',
			},
		};

		this.initSelectors();
	}


	initSelectors(): void {
		this.store
			.select(selectReservations)
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe((res) => {
				this.mergeEvents(res);
			});
	}

	onCreated(): void {
		this.loadEvents();
	}

	onNavigating(): void {
		setTimeout(() => this.loadEvents(), 0);
	}

	private loadEvents(): void {
		if (!this.scheduleObj) return;

		const dates: Date[] = this.scheduleObj.getCurrentViewDates();
		if (!dates?.length) return;

		const start = new Date(dates[0]);
		start.setHours(0, 0, 0, 0);
		const end = new Date(dates[dates.length - 1]);
		end.setHours(23, 59, 59, 999);

		this.store.dispatch(AppAction.loadReservations({ start, end }));
	}

	private mergeEvents(reservations: Reservation[]): void {
		const events: ScheduleEvent[] = reservations.map(
			(r: Reservation): ScheduleEvent => this.toScheduleEvent(r),
		);

		if (this.scheduleObj) this.scheduleObj.eventSettings = { ...this.eventSettings, dataSource: events };
	}

	private toScheduleEvent(r: Reservation): ScheduleEvent {
		return {
			Id: r.uuid,
			Subject: r.name,
			StartTime: r.startTime,
			EndTime: r.endTime,
			Room: r.room,
			ReservedBy: r.reservedBy,
			Status: r.status,
			Note: r.note ?? '',
			IsReadonly: r.status !== 'PENDING',
			CssClass: `event-status-${r.status.toLowerCase()}`,
		};
	}

	onPopupOpen(args: PopupOpenEventArgs): void {
		if (args.type === 'Editor' || args.type === 'QuickInfo') {
			args.cancel = true;
		}
	}

	onActionBegin(args: ActionEventArgs): void {
		if (['eventCreate', 'eventChange', 'eventRemove'].includes(args.requestType ?? '')) {
			args.cancel = true;
		}
	}

	onCellClick(args: CellClickEventArgs): void {
		this.modalService.openRequestReservationDialog({
			startTime: args.startTime,
			endTime: args.endTime,
		});
	}

	onEventClick(args: EventClickArgs): void {
		const event = args.event as ScheduleEvent;

		if (event.Status !== 'PENDING') return;

		this.confirmationService.confirm({
			message: 'Are you sure you want to cancel this pending reservation request?',
			header: 'Cancel reservation request',
			icon: 'pi pi-exclamation-triangle',
			acceptLabel: 'Yes, cancel it',
			rejectLabel: 'Go back',
			acceptButtonStyleClass: 'p-button-danger',
			accept: () => {
				this.store.dispatch(
					AppAction.reviewReservation({
						review: {
							uuid: event.Id,
							status: ReservationStatus.REJECTED,
						},
					}),
				);
			},
		});
	}
}