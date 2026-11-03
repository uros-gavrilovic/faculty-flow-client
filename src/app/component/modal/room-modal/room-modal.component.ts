import { Component, computed, DestroyRef, effect, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Actions, ofType } from '@ngrx/effects';
import { Action, ActionCreator, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { COMMON_MODULES } from '../../../modules/common.module';
import { PRIMENG_MODULES } from '../../../modules/ui.module';
import { Building, Room, RoomType } from '../../../model/room.model';
import * as AppAction from '../../../store/app.action';
import * as AppSelector from '../../../store/app.selector';
import { BUILDING_ICONS, ROOM_TYPE_ICONS } from '../../../constant/icon.constant';

export interface RoomDialogData {
	room?: Partial<Room>;
	onCloseCallback?: () => void;
}

interface RoomFormValue {
	name?: string | null;
	code?: string | null;
	type?: RoomType | null;
	floor?: number | null;
	building?: Building | null;
	oldName?: string | null;
	capacity?: number | null;
}

@Component({
	selector: 'app-room-modal',
	imports: [COMMON_MODULES, PRIMENG_MODULES],
	templateUrl: './room-modal.component.html',
	styleUrl: './room-modal.component.scss',
})
export class RoomModalComponent implements OnInit {
	readonly form: FormGroup;
	readonly isEditMode: boolean;
	private initialDataLoaded = false;

	readonly room: Signal<Room>;
	readonly submitting: WritableSignal<boolean> = signal(false);
	readonly deleting: WritableSignal<boolean> = signal(false);
	readonly busy: Signal<boolean> = computed(() => this.submitting() || this.deleting());

	readonly roomTypes: RoomType[] = Object.values(RoomType);
	readonly buildings: Building[] = Object.values(Building);
	readonly roomTypeIcons = ROOM_TYPE_ICONS;
	readonly buildingIcons = BUILDING_ICONS;

	private readonly formValue: Signal<RoomFormValue>;

	readonly displayName: Signal<string> = computed(() => this.formValue().name?.trim() ?? '');
	readonly code: Signal<string> = computed(() => this.formValue().code?.trim() ?? '');
	readonly type: Signal<RoomType | null> = computed(() => this.formValue().type ?? null);
	readonly building: Signal<Building | null> = computed(() => this.formValue().building ?? null);
	readonly floor: Signal<number | null> = computed(() => this.formValue().floor ?? null);
	readonly capacity: Signal<number | null> = computed(() => this.formValue().capacity ?? null);
	readonly metaParts: Signal<string[]> = computed(() => {
		const type: RoomType | null = this.type();
		const building: Building | null = this.building();
		const floor: number | null = this.floor();
		const t = (key: string, params?: object): string => this.translateService.instant(key, params);

		return [
			type ? t(`enum.room-type.${type.toLowerCase()}`) : null,
			building
				? t('modal.room.building-label', { building: t(`enum.building.${building.toLowerCase()}`) })
				: null,
			floor !== null ? t('modal.room.floor-label', { floor }) : null,
		].filter((part): part is string => !!part);
	});
	readonly summaryIcon: Signal<string> = computed(() => {
		const type: RoomType | null = this.type();
		return type ? ROOM_TYPE_ICONS[type] : 'pi pi-building';
	});

	constructor(
		private store: Store,
		private formBuilder: FormBuilder,
		private actions$: Actions,
		private ref: DynamicDialogRef,
		private config: DynamicDialogConfig<RoomDialogData>,
		private confirmationService: ConfirmationService,
		private translateService: TranslateService,
		private destroyRef: DestroyRef,
	) {
		this.room = this.store.selectSignal(AppSelector.selectRoom);
		this.isEditMode = !!this.config.data?.room?.uuid;

		this.form = this.formBuilder.group({
			name: ['', [Validators.required, Validators.maxLength(120)]],
			code: ['', [Validators.required, Validators.maxLength(50)]],
			type: [null, Validators.required],
			floor: [null],
			building: [null],
			oldName: [''],
			capacity: [null, Validators.min(0)],
		});
		this.formValue = toSignal(this.form.valueChanges, { initialValue: this.form.value });

		effect(() => {
			const room: Room = this.room();

			if (this.isEditMode && room && !this.initialDataLoaded) {
				this.initialDataLoaded = true;
				this.patchForm(room);
			}
		});
	}

	ngOnInit(): void {
		if (this.isEditMode) {
			this.store.dispatch(AppAction.getRoom({ uuid: this.config.data.room!.uuid! }));
		}
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

	selectType(type: RoomType): void {
		if (this.busy()) return;
		this.form.get('type')?.setValue(type);
		this.form.get('type')?.markAsTouched();
	}

	selectBuilding(building: Building): void {
		if (this.busy()) return;
		const control = this.form.get('building');
		control?.setValue(control.value === building ? null : building);
	}

	onSubmit(): void {
		if (this.busy()) return;

		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}

		const value = this.form.getRawValue();
		const room: Room = {
			...this.room(),
			name: value.name.trim(),
			code: value.code.trim(),
			type: value.type,
			floor: value.floor,
			building: value.building,
			oldName: value.oldName?.trim() || undefined,
			capacity: value.capacity,
		};

		if (this.isEditMode) {
			this.closeOnSuccess(AppAction.updateRoomSuccess, this.submitting);
			this.store.dispatch(AppAction.updateRoom({ room }));
		} else {
			this.closeOnSuccess(AppAction.createRoomSuccess, this.submitting);
			this.store.dispatch(AppAction.createRoom({ room }));
		}
	}

	onDelete(): void {
		const uuid: string | undefined = this.room()?.uuid;
		if (!uuid || this.busy()) return;

		this.confirmationService.confirm({
			header: this.translateService.instant('modal.room.delete-confirm.title'),
			message: this.translateService.instant('modal.room.delete-confirm.message', {
				name: this.room().name,
			}),
			icon: 'pi pi-exclamation-triangle',
			acceptLabel: this.translateService.instant('common.delete'),
			rejectLabel: this.translateService.instant('common.cancel'),
			acceptButtonProps: { severity: 'danger', icon: 'pi pi-trash' },
			rejectButtonProps: { severity: 'secondary', text: true },
			accept: () => {
				this.closeOnSuccess(AppAction.deleteRoomSuccess, this.deleting);
				this.store.dispatch(AppAction.deleteRoom({ uuid }));
			},
		});
	}

	onClose(): void {
		this.ref.close(true);
	}

	private closeOnSuccess(
		successAction: ActionCreator<string, () => Action>,
		pending: WritableSignal<boolean>,
	): void {
		pending.set(true);

		this.actions$
			.pipe(ofType(successAction, AppAction.roomFailure), take(1), takeUntilDestroyed(this.destroyRef))
			.subscribe((action) => {
				pending.set(false);
				if (action.type === successAction.type) this.onClose();
			});
	}
}
