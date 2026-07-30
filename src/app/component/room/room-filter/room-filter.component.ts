import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PRIMENG_MODULES } from 	'../../../modules/ui.module';
import { COMMON_MODULES } from '../../../modules/common.module';
import { RoomFilter } from '../../../model/room.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import * as UtilFunction from '../../../util/util-functions'

@Component({
	selector: 'app-room-filter',
	imports: [COMMON_MODULES, PRIMENG_MODULES],
	templateUrl: './room-filter.component.html',
	styleUrl: './room-filter.component.scss',
})
export class RoomFilterComponent implements OnInit {

	@Output() filterChange = new EventEmitter<RoomFilter>();

	form: FormGroup;

	constructor(
		private fb: FormBuilder
	) {}

	ngOnInit(): void {
		this.form = this.fb.group({
			name: [null],
			code: [null],
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