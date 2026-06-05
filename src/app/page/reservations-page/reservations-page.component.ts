import { Component } from '@angular/core';
import { ReservationTableComponent } from '../../component/reservation/reservation-table/reservation-table.component';
import { Card } from 'primeng/card';

@Component({
	selector: 'app-reservations-page',
	imports: [ReservationTableComponent, Card],
	templateUrl: './reservations-page.component.html',
	styleUrl: './reservations-page.component.scss',
})
export class ReservationsPageComponent {}
