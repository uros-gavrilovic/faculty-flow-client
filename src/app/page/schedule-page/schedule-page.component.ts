import { Component, DestroyRef, effect, OnInit, Signal, ViewChild } from '@angular/core';
import {
	ActionEventArgs,
	AgendaService,
	CellClickEventArgs,
	DayService,
	DragAndDropService,
	EventClickArgs,
	EventRenderedArgs,
	EventSettingsModel,
	MonthAgendaService,
	MonthService,
	PopupOpenEventArgs,
	ResizeService,
	ScheduleComponent,
	ScheduleModule,
	SelectEventArgs,
	TimelineMonthService,
	TimelineViewsService,
	TimelineYearService,
	WeekService,
	WorkWeekService,
} from '@syncfusion/ej2-angular-schedule';
import { Reservation, ReservationFilter, ReservationStatus } from '../../model/reservation.model';
import { ConfirmationService } from 'primeng/api';
import { ModalService } from '../../service/modal.service';
import { Store } from '@ngrx/store';
import * as AppAction from '../../store/app.action';
import * as AppSelector from '../../store/app.selector';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {ScheduleEvent} from '../../model/scheduler.model';
import { ScheduleFilterComponent } from '../../component/schedule/schedule-filter/schedule-filter.component';
import { SearchResponse } from '../../model/search.model';
import { DatePipe } from '@angular/common';
import { COMMON_MODULES } from '../../modules/common.module';
import { formatToLocalDateTimeString } from '../../util/util-functions';
import { combineLatest } from 'rxjs';
import { User, UserRole } from '../../model/user.model';

@Component({
	selector: 'app-schedule-page',
	imports: [ScheduleModule, ScheduleFilterComponent, DatePipe, COMMON_MODULES],
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
		DragAndDropService,
		ResizeService,
	],
	templateUrl: './schedule-page.component.html',
	styleUrl: './schedule-page.component.scss',
})
export class SchedulePageComponent implements OnInit {
	filter: ReservationFilter;
	eventSettings: EventSettingsModel;

	reservations: Signal<Reservation[]>;

	@ViewChild('scheduleObj') scheduleObj!: ScheduleComponent;

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
				location: { name: 'Location' },
				description: { name: 'Note' },
				isReadonly: 'IsReadonly',
			},
		};

		this.initSelectors();
	}

	initSelectors(): void {
		combineLatest([
			this.store.select(AppSelector.selectReservations),
			this.store.select(AppSelector.selectCurrentUser),
		])
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe(([response, user]: [SearchResponse<Reservation>, User]): void => {
				this.mergeEvents(response, user);
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

		this.store.dispatch(
			AppAction.searchReservations({
				searchRequest: {
					page: 0,
					size: 1000,
					filter: {
						...this.filter,
						startTime: formatToLocalDateTimeString(start),
						endTime: formatToLocalDateTimeString(end),
					},
				},
			}),
		);
	}

	private mergeEvents(response: SearchResponse<Reservation>, user: User): void {
		const events: ScheduleEvent[] = response.data?.map(
			(r: Reservation): ScheduleEvent => this.toScheduleEvent(r, user),
		);

		if (this.scheduleObj)
			this.scheduleObj.eventSettings = { ...this.eventSettings, dataSource: events };
	}

	private toScheduleEvent(r: Reservation, user: User): ScheduleEvent {
		const canEdit: boolean =
			user?.username === r.reservedBy || !!user?.roles?.includes(UserRole.ADMINISTRATOR);

		return {
			Id: r.uuid,
			Subject: r.name,
			StartTime: new Date(r.startTime),
			EndTime: new Date(r.endTime),
			Location: r.room,
			ReservedBy: r.reservedBy,
			ReviewedBy: r.reviewedBy,
			Type: r.eventType,
			Status: r.status,
			Note: r.note ?? '',
			Comment: r.comment ?? '',
			IsReadonly: r.status !== ReservationStatus.PENDING || !canEdit,
		};
	}

	private toReservation(scheduleEvent: ScheduleEvent): Reservation {
		return {
			uuid: scheduleEvent.Id,
			name: scheduleEvent.Subject,
			room: scheduleEvent.Location,
			startTime: formatToLocalDateTimeString(scheduleEvent.StartTime),
			endTime: formatToLocalDateTimeString(scheduleEvent.EndTime),
			reservedBy: scheduleEvent.ReservedBy,
			reviewedBy: scheduleEvent.ReviewedBy,
			eventType: scheduleEvent.Type,
			status: scheduleEvent.Status,
			note: scheduleEvent.Note || null,
			comment: scheduleEvent.Comment || null,
		};
	}
	onPopupOpen(args: PopupOpenEventArgs): void {
		if (args.type === 'Editor' || args.type === 'QuickInfo') {
			args.cancel = true;
		}
	}

	onActionBegin(args: ActionEventArgs): void {
		if (!['eventCreate', 'eventChange', 'eventRemove'].includes(args.requestType ?? '')) return;

		args.cancel = true;

		const changed = args.changedRecords?.[0] as ScheduleEvent | undefined;
		if (args.requestType === 'eventChange' && changed) {
			this.store.dispatch(AppAction.updateReservation({ reservation: this.toReservation(changed) }));
		}
	}

	onCellClick(args: CellClickEventArgs): void {
		this.modalService.openReservationPreviewModal({
			startTime: args.startTime,
			endTime: args.endTime,
		});
	}

	onCellSelect(args: SelectEventArgs): void {
		if (args.requestType !== 'cellSelect' || this.scheduleObj.getSelectedCells().length < 2) return;

		const { StartTime, EndTime } = args.data as Record<string, Date>;

		this.modalService.openReservationPreviewModal({
			startTime: StartTime,
			endTime: EndTime,
		});
	}

	onEventClick(args: EventClickArgs): void {
		const scheduleEvent: ScheduleEvent = args.event as ScheduleEvent;

		this.modalService.openReservationPreviewModal({
			reservation: this.toReservation(scheduleEvent),
		});
	}

	protected onFilterChange(filter: ReservationFilter): void {
		this.filter = filter;
		this.loadEvents();
	}

	onDataBound(): void {
		const appointments = document.querySelectorAll<HTMLElement>('.e-appointment');
		appointments.forEach((element: HTMLElement) => {
			const width: number = element.getBoundingClientRect().width;
			if (width < 200) element.classList.add('compact');

			// const height: number = element.getBoundingClientRect().height;
		});
	}

	onEventRendered(args: EventRenderedArgs): void {
		const event = args.data as ScheduleEvent;
		const colors = this.statusColorMap[event.Status];

		if (!colors) return;

		args.element.style.background = colors.background;
		args.element.style.borderLeft = `3px solid ${colors.border}`;
		args.element.style.color = colors.color;
	}

	readonly statusColorMap: Record<
		ReservationStatus,
		{ background: string; border: string; color: string }
	> = {
		[ReservationStatus.PENDING]: {
			background: '#f1f5f9', // secondary
			border: '#94a3b8',
			color: '#475569',
		},
		[ReservationStatus.CANCELED]: {
			background: '#fef3c7', // warn
			border: '#d97706',
			color: '#92400e',
		},
		[ReservationStatus.ACCEPTED]: {
			background: '#dcfce7', // success
			border: '#16a34a',
			color: '#14532d',
		},
		[ReservationStatus.REJECTED]: {
			background: '#fee2e2', // danger
			border: '#dc2626',
			color: '#7f1d1d',
		},
	};
}