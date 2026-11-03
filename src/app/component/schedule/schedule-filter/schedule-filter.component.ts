import { Component, EventEmitter, Input, OnInit, Output, Signal } from '@angular/core';
import { PRIMENG_MODULES } from '../../../modules/ui.module';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReservationFilter, ReservationStatus } from '../../../model/reservation.model';
import { COMMON_MODULES } from '../../../modules/common.module';
import { Store } from '@ngrx/store';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import * as UtilFunction from '../../../util/util-functions';
import { TableLazyLoadEvent } from 'primeng/table';
import { User, UserRole } from '../../../model/user.model';
import * as AppSelector from '../../../store/app.selector';
import { RoomSelectComponent } from '../../room/room-select/room-select.component';

@Component({
	selector: 'app-schedule-filter',
	imports: [PRIMENG_MODULES, COMMON_MODULES, RoomSelectComponent],
	templateUrl: './schedule-filter.component.html',
	styleUrl: './schedule-filter.component.scss',
})
export class ScheduleFilterComponent implements OnInit {

	@Input() applyCurrentUserFilter: boolean;
	@Output() filterChange: EventEmitter<ReservationFilter> = new EventEmitter<ReservationFilter>();

	form: FormGroup;
	currentUser: Signal<User>;

	readonly statuses: ReservationStatus[] = Object.values(ReservationStatus);

	constructor(
		private fb: FormBuilder,
		private store: Store,
	) {
		this.initDispatch();
	}

	private initDispatch(): void {
		this.currentUser = this.store.selectSignal(AppSelector.selectCurrentUser);
	}

	ngOnInit(): void {
		this.initForm();
	}

	private initForm(): void {
		this.form = this.fb.group({
			name: [null],
			room: [null],
			status: [null],
			reservedBy: [this.applyCurrentUserFilter ? this.currentUser()?.username : null],
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
