import { Component, Input } from '@angular/core';
import { PRIMENG_MODULES } from '../../../modules/ui.module';
import { COMMON_MODULES } from '../../../modules/common.module';

@Component({
	selector: 'app-page-header',
	imports: [COMMON_MODULES, PRIMENG_MODULES],
	templateUrl: './page-header.component.html',
	styleUrl: './page-header.component.scss',
})
export class PageHeaderComponent {

	@Input() icon: string;
	@Input() title: string;
	@Input() description: string;
}
