import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval, take } from 'rxjs';
import { BackgroundComponent } from '../../component/background/background.component';
import { PRIMENG_MODULES } from '../../modules/ui.module';
import { COMMON_MODULES } from '../../modules/common.module';
import { UserApiService } from '../../service/user-api.service';
import { PageUrl } from '../../constant/page-url.constant';

type VerifyStatus = 'loading' | 'success' | 'error';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const REDIRECT_SECONDS = 5;

@Component({
	selector: 'app-verify-account-page',
	imports: [BackgroundComponent, ...PRIMENG_MODULES, ...COMMON_MODULES],
	templateUrl: './verify-account-page.component.html',
	styleUrl: './verify-account-page.component.scss',
})
export class VerifyAccountPageComponent implements OnInit {

	private route = inject(ActivatedRoute);
	private router = inject(Router);
	private userApi = inject(UserApiService);
	private destroyRef = inject(DestroyRef);

	status = signal<VerifyStatus>('loading');
	countdown = signal<number>(REDIRECT_SECONDS);

	ngOnInit(): void {
		const token = this.route.snapshot.queryParamMap.get('token');

		if (!token || !UUID_REGEX.test(token)) {
			this.status.set('error');
			return;
		}

		this.userApi
			.verifyAccount(token)
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: () => {
					this.status.set('success');
					this.startRedirectCountdown();
				},
				error: () => this.status.set('error'),
			});
	}

	private startRedirectCountdown(): void {
		interval(1000)
			.pipe(take(REDIRECT_SECONDS), takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (i: number) => this.countdown.set(REDIRECT_SECONDS - i - 1),
				complete: () => this.goToLogin(),
			});
	}

	goToLogin(): void {
		this.router.navigate([PageUrl.LOGIN]);
	}
}
