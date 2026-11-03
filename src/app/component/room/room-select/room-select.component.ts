import { Component, computed, DestroyRef, forwardRef, input, output, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { catchError, debounceTime, map, of, Subject, switchMap, tap } from 'rxjs';
import { COMMON_MODULES } from '../../../modules/common.module';
import { PRIMENG_MODULES } from '../../../modules/ui.module';
import { Room } from '../../../model/room.model';
import { SearchResponse } from '../../../model/search.model';
import { RoomApiService } from '../../../service/room-api.service';
import { ROOM_TYPE_ICONS } from '../../../constant/icon.constant';

interface PageQuery {
	term: string;
	page: number;
}


@Component({
	selector: 'app-room-select',
	imports: [COMMON_MODULES, PRIMENG_MODULES],
	templateUrl: './room-select.component.html',
	styleUrl: './room-select.component.scss',
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => RoomSelectComponent),
			multi: true,
		},
	],
})
export class RoomSelectComponent implements ControlValueAccessor {

	static readonly PAGE_SIZE = 20; /** Height of one option row in px; must match the option styles for virtual scrolling. */
	static readonly ITEM_SIZE = 48; /** Start loading the next page when this many rows remain below the visible area. */
	private static readonly PREFETCH_THRESHOLD = 5;

	readonly inputId = input<string>();
	readonly placeholder = input<string>();
	readonly readonly = input<boolean>(false);
	readonly showClear = input<boolean>(true);
	/** Adds left offset to the selected value when the select sits inside a p-iconfield. */
	readonly indent = input<boolean>(false);

	/** Emits the full room whenever the selection is resolved or changed. */
	readonly roomSelected = output<Room | null>();

	readonly roomTypeIcons = ROOM_TYPE_ICONS;
	readonly itemSize = RoomSelectComponent.ITEM_SIZE;
	readonly virtualScrollOptions = {
		onScrollIndexChange: (range: { first: number; last: number }) =>
			this.onScrollIndexChange(range),
	};

	readonly value: WritableSignal<string | null> = signal(null);
	readonly disabled: WritableSignal<boolean> = signal(false);
	readonly loading: WritableSignal<boolean> = signal(false);
	readonly selectedRoom: WritableSignal<Room | null> = signal(null);

	private readonly results: WritableSignal<Room[]> = signal([]);
	private readonly total: WritableSignal<number> = signal(0);
	private readonly loaded: WritableSignal<boolean> = signal(false);
	private readonly loadingPage: WritableSignal<number> = signal(0);
	private term = '';
	private page = 0;

	/** Loaded results, with the current selection kept in the list so its label always renders. */
	readonly options = computed<Room[]>(() => {
		const selected: Room | null = this.selectedRoom();
		const results: Room[] = this.results();

		if (!selected || results.some((room: Room) => room.code === selected.code)) return results;
		return [selected, ...results];
	});
	readonly loadingMore = computed<boolean>(() => this.loading() && this.loadingPage() > 0);
	readonly hasMore = computed<boolean>(
		() => this.loaded() && this.results().length < this.total(),
	);

	private readonly query$ = new Subject<PageQuery>();
	private readonly filter$ = new Subject<string>();

	private onChange: (value: string | null) => void = () => {};
	private onTouched: () => void = () => {};

	constructor(
		private roomApi: RoomApiService,
		private destroyRef: DestroyRef,
	) {
		this.query$
			.pipe(
				tap(() => this.loading.set(true)),
				switchMap((query: PageQuery) =>
					this.roomApi.searchRooms(this.toSearchRequest(query)).pipe(
						map((response: SearchResponse<Room>) => ({ query, response })),
						catchError(() => of({ query, response: null })),
					),
				),
				takeUntilDestroyed(this.destroyRef),
			)
			.subscribe(({ query, response }) => {
				this.loading.set(false);
				if (!response) return;

				const data: Room[] = Array.from(response.data ?? []);
				this.results.set(query.page === 0 ? data : [...this.results(), ...data]);
				this.total.set(response.total ?? 0);
				this.loaded.set(true);
			});

		this.filter$
			.pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef))
			.subscribe((term: string) => {
				if (term !== this.term) this.load(term, 0);
			});
	}

	// ---------- Dropdown events ----------

	onShow(): void {
		if (!this.loaded() && !this.loading()) this.load('', 0);
	}

	onHide(): void {
		// Filter text is reset on hide, so reset the server query to match.
		if (this.term) this.load('', 0);
	}

	onFilter(term: string): void {
		this.filter$.next((term ?? '').trim());
	}

	private onScrollIndexChange({ last }: { first: number; last: number }): void {
		if (this.loading() || !this.hasMore()) return;
		if (last >= this.options().length - RoomSelectComponent.PREFETCH_THRESHOLD) {
			this.load(this.term, this.page + 1);
		}
	}

	onSelect(code: string | null): void {
		this.value.set(code);
		const room: Room | null = code
			? (this.options().find((r: Room) => r.code === code) ?? null)
			: null;
		this.selectedRoom.set(room);

		this.onChange(code);
		this.roomSelected.emit(room);
	}

	onBlur(): void {
		this.onTouched();
	}

	// ---------- ControlValueAccessor ----------

	writeValue(code: string | null): void {
		this.value.set(code || null);

		if (!code) {
			this.selectedRoom.set(null);
			return;
		}

		if (this.selectedRoom()?.code === code) return;

		const known: Room | undefined = this.results().find((room: Room) => room.code === code);
		if (known) {
			this.selectedRoom.set(known);
			this.roomSelected.emit(known);
			return;
		}

		this.roomApi
			.findByCode(code)
			.pipe(
				catchError(() => of(null)),
				takeUntilDestroyed(this.destroyRef),
			)
			.subscribe((room: Room | null) => {
				if (this.value() !== code) return; // Ignore if the value changed while the lookup was in flight.
				this.selectedRoom.set(room);
				this.roomSelected.emit(room);
			});
	}

	registerOnChange(fn: (value: string | null) => void): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: () => void): void {
		this.onTouched = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		this.disabled.set(isDisabled);
	}

	// ---------- Helpers ----------

	private load(term: string, page: number): void {
		this.term = term;
		this.page = page;
		this.loadingPage.set(page);
		this.query$.next({ term, page });
	}

	private toSearchRequest({ term, page }: PageQuery) {
		return {
			page,
			size: RoomSelectComponent.PAGE_SIZE,
			sortBy: 'name',
			direction: 'ASC' as const,
			filter: term ? { name: term } : {},
		};
	}
}
