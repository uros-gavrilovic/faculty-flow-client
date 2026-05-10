import { Component, OnDestroy, OnInit, Signal, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { APP_STATE_KEY, AppState } from './store/app.store';
import { Store } from '@ngrx/store';
import { selectAppState } from './store/app.selector';

@Component({
	selector: 'app-root',
	imports: [RouterOutlet],
	templateUrl: './app.html',
	styleUrl: './app.scss',
})
export class App implements OnInit, OnDestroy {

	constructor(
		private store: Store<AppState>,
	) {}

	ngOnInit(): void {
		window.addEventListener('beforeunload', this.onBeforeUnload);
	}

	ngOnDestroy(): void {
		window.removeEventListener('beforeunload', this.onBeforeUnload);
	}

	onBeforeUnload = (event: BeforeUnloadEvent): void => {
		const appState: Signal<AppState> = this.store.selectSignal(selectAppState);
		localStorage.setItem(APP_STATE_KEY, JSON.stringify(appState()));
	};
}
