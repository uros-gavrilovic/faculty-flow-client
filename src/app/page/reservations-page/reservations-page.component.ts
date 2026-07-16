import { Component } from '@angular/core';
import { ReservationTableComponent } from '../../component/reservation/reservation-table/reservation-table.component';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { PrimeTemplate } from 'primeng/api';
import { Toolbar } from 'primeng/toolbar';
import { TranslatePipe } from '@ngx-translate/core';
import { PRIMENG_MODULES } from '../../modules/ui.module';
import { COMMON_MODULES } from '../../modules/common.module';

@Component({
	selector: 'app-reservations-page',
	imports: [PRIMENG_MODULES, COMMON_MODULES, ReservationTableComponent],
	templateUrl: './reservations-page.component.html',
	styleUrl: './reservations-page.component.scss',
})
export class ReservationsPageComponent {}
