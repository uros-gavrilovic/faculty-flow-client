import { Component, Input } from '@angular/core';
import { COMMON_MODULES } from '../../../modules/common.module';
import { PRIMENG_MODULES } from '../../../modules/ui.module';

@Component({
	selector: 'app-panel-stepper',
	imports: [COMMON_MODULES, PRIMENG_MODULES],
	templateUrl: './panel-stepper.component.html',
	styleUrl: './panel-stepper.component.scss',
})
export class PanelStepperComponent {
	@Input() title: string;
	@Input() icon: string;
	@Input() iconStyleClass: string;
	@Input() toggleable: boolean = false;
}
