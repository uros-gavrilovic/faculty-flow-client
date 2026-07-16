import { Component, effect, EventEmitter, OnInit, Output, Signal } from '@angular/core';
import { PRIMENG_MODULES } from '../../../modules/ui.module';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReservationFilter, ReservationStatus } from '../../../model/reservation.model';
import { COMMON_MODULES } from '../../../modules/common.module';
import { selectRooms } from '../../../store/app.selector';
import { Room } from '../../../model/room.model';
import * as AppAction from '../../../store/app.action';
import { Store } from '@ngrx/store';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import * as UtilFunction from '../../../util/util-functions';

@Component({
	selector: 'app-schedule-filter',
	imports: [PRIMENG_MODULES, COMMON_MODULES],
	templateUrl: './schedule-filter.component.html',
	styleUrl: './schedule-filter.component.scss',
})
export class ScheduleFilterComponent implements OnInit {

	@Output() filterChange: EventEmitter<ReservationFilter> = new EventEmitter<ReservationFilter>();

	form: FormGroup;
	rooms: Signal<Room[]>;

	readonly statuses: ReservationStatus[] = Object.values(ReservationStatus);

	constructor(
		private fb: FormBuilder,
		private store: Store,
	) {
		this.initDispatch();
	}

	private initDispatch(): void {
		this.rooms = this.store.selectSignal(selectRooms);

		effect(() => {
			const availableRooms: Room[] = this.rooms();
			if (!availableRooms?.length) this.store.dispatch(AppAction.getRooms());
		});
	}

	ngOnInit(): void {
		this.initForm();
	}

	private initForm(): void {
		this.form = this.fb.group({
			name: [null],
			room: [null],
			status: [null],
			reservedBy: [null],
		});
		this.form.valueChanges
			.pipe(
				debounceTime(300),
				distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
				map((value) => UtilFunction.filterEmptyFields(value)),
			)
			.subscribe((value) => this.filterChange.emit(value));
	}

	onClear(): void {
		this.form.reset();
	}
}
