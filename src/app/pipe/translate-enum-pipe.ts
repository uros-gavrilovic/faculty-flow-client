import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
	name: 'translateEnum',
	standalone: true,
})
export class TranslateEnumPipe implements PipeTransform {

	constructor(
		private translateService: TranslateService,
	) {}

	transform(value: string | null | undefined, prefix?: string): string {
		if (!value) return '';

		const key = prefix ? `${prefix}.${value.toLowerCase()}` : value.toLowerCase();

		return this.translateService.instant(key);
	}
}