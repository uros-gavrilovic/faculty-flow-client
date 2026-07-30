import { Component, effect, OnInit, Signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Store } from '@ngrx/store';
import { COMMON_MODULES } from '../../../modules/common.module';
import { PRIMENG_MODULES } from '../../../modules/ui.module';
import { Room, Building, RoomType } from '../../../model/room.model';
import * as AppAction from '../../../store/app.action';
import * as AppSelector from '../../../store/app.selector';

export interface RoomDialogData {
	room?: Partial<Room>;
	onCloseCallback?: () => void;
}

@Component({
	selector: 'app-room-modal',
	imports: [COMMON_MODULES, PRIMENG_MODULES],
	templateUrl: './room-modal.component.html',
	styleUrl: './room-modal.component.scss',
})
export class RoomModalComponent implements OnInit {
	form: FormGroup;
	submitting = false;
	isEditMode = false;
	initialDataLoaded = false;

	room: Signal<Room>;

	readonly roomTypes = Object.values(RoomType);
	readonly buildings = Object.values(Building);

	constructor(
		private store: Store,
		private formBuilder: FormBuilder,
		private ref: DynamicDialogRef,
		private config: DynamicDialogConfig<RoomDialogData>,
	) {
		this.room = this.store.selectSignal(AppSelector.selectRoom);

		this.isEditMode = !!this.config.data?.room?.uuid;

		this.initForm();

		effect(() => {
			const room = this.room();

			if (this.isEditMode && room && !this.initialDataLoaded) {
				this.initialDataLoaded = true;
				this.patchForm(room);
			}
		});
	}

	ngOnInit(): void {
		if (this.isEditMode) {
			this.store.dispatch(
				AppAction.getRoom({
					uuid: this.config.data.room!.uuid!,
				}),
			);
		}
	}

	private initForm(): void {
		this.form = this.formBuilder.group({
			name: ['', [Validators.required, Validators.maxLength(120)]],
			code: ['', [Validators.required, Validators.maxLength(50)]],
			type: [null, Validators.required],
			floor: [null],
			building: [null],
			oldName: [''],
			capacity: [null],
		});
	}

	private patchForm(room: Room): void {
		this.form.patchValue({
			name: room.name,
			code: room.code,
			type: room.type,
			floor: room.floor,
			building: room.building,
			oldName: room.oldName,
			capacity: room.capacity,
		});
	}

	onSubmit(): void {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}

		const value = this.form.getRawValue();

		const room: Room = {
			...this.room(),
			name: value.name,
			code: value.code,
			type: value.type,
			floor: value.floor,
			building: value.building,
			oldName: value.oldName || undefined,
			capacity: value.capacity,
		};

		this.submitting = true;

		if (this.isEditMode) {
			this.store.dispatch(AppAction.updateRoom({ room }));
		} else {
			this.store.dispatch(AppAction.createRoom({ room }));
		}

		this.onClose();
	}

	onDelete(): void {
		if (!this.room()?.uuid) return

		this.store.dispatch(AppAction.deleteRoom({ uuid: this.room().uuid, }),);

		this.onClose();
	}

	onClose(): void {
		this.ref.close(true);
	}
}
