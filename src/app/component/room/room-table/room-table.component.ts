import { Component, OnInit, Signal, signal, ViewChild, WritableSignal, model } from '@angular/core';
import { Store } from '@ngrx/store';
import { ScheduleFilterComponent } from '../../schedule/schedule-filter/schedule-filter.component';
import { COMMON_MODULES } from '../../../modules/common.module';
import { PRIMENG_MODULES } from '../../../modules/ui.module';
import { TableLazyLoadEvent } from 'primeng/table';
import { TranslateService } from '@ngx-translate/core';
import { SearchRequest, SearchResponse } from '../../../model/search.model';
import { User } from '../../../model/user.model';
import { Room, RoomFilter } from '../../../model/room.model';
import { SortEvent } from 'primeng/api';
import * as AppAction from '../../../store/app.action';
import * as AppSelector from '../../../store/app.selector';
import { Actions, ofType } from '@ngrx/effects';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
	selector: 'app-room-table',
	imports: [COMMON_MODULES, PRIMENG_MODULES],
	templateUrl: './room-table.component.html',
	styleUrl: './room-table.component.scss',
})
export class RoomTableComponent {
	searchRequest: SearchRequest<RoomFilter>;
	currentUser: Signal<User>;
	rooms = signal<SearchResponse<Room> | null>(null);

	isFilterVisible = model(true);

	constructor(
		private store: Store,
		private actions$: Actions,
		private translateService: TranslateService,
	) {}

	ngOnInit(): void {
		this.currentUser = this.store.selectSignal(AppSelector.selectCurrentUser);

		this.searchRequest = {
			page: 0,
			size: 10,
			filter: {},
		};

		this.actions$
			.pipe(ofType(AppAction.searchRoomsSuccess))
			.subscribe(({ searchResponse }) => {
				this.rooms.set(searchResponse);
			});

		this.store.dispatch(AppAction.searchRooms({ searchRequest: this.searchRequest }));
	}

	onPage(event: TableLazyLoadEvent): void {
		this.searchRequest = {
			...this.searchRequest,
			page: event.first! / event.rows!,
			size: event.rows!,
		};

		this.store.dispatch(AppAction.searchRooms({ searchRequest: this.searchRequest }));
	}

	onSort(event: SortEvent): void {
		this.searchRequest = {
			...this.searchRequest,
			page: 0,
			sortBy: event.field,
			direction: event.order === 1 ? 'ASC' : 'DESC',
		};

		this.store.dispatch(AppAction.searchRooms({ searchRequest: this.searchRequest }));
	}

	onFilterChange(filter: RoomFilter): void {
		this.searchRequest = {
			...this.searchRequest,
			page: 0,
			filter,
		};

		this.store.dispatch(AppAction.searchRooms({ searchRequest: this.searchRequest }));
	}

	get showingRoomsTemplate(): string {
		return this.translateService.instant('room.pagination');
	}

	protected onRoomSelect(room: Room): void {
		// TODO:
		// this.modalService.openRoomModal({ room });
		// or
		// this.router.navigate(['/rooms', room.uuid]);
	}
}