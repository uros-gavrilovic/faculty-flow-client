import { Component } from '@angular/core';
import { NgParticlesService, NgxParticlesModule } from '@tsparticles/angular';
import { Engine } from '@tsparticles/engine';
import { loadFull } from 'tsparticles';
import { backgroundConfig } from './background-config';

@Component({
	selector: 'app-background',
	standalone: true,
	imports: [NgxParticlesModule],
	templateUrl: './background.component.html',
	styleUrl: './background.component.scss',
})
export class BackgroundComponent {
	id = 'ts-particles';

	protected readonly backgroundConfig: any = backgroundConfig;

	constructor(private readonly ngParticlesService: NgParticlesService) {}

	ngOnInit(): void {
		this.ngParticlesService.init(async (engine: Engine): Promise<void> => {
			await loadFull(engine);
		});
	}
}
