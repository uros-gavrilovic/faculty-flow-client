export const backgroundConfig = {
	key: 'faculty-flow',
	name: 'faculty-flow',
	particles: {
		number: {
			value: 40,
			density: {
				enable: true,
			},
		},
		paint: {
			fill: {
				color: {
					value: '#ffffff',
				},
			},
		},
		shape: {
			type: 'circle',
		},
		opacity: {
			value: {
				min: 0.1,
				max: 0.2,
			},
			animation: {
				enable: false,
			},
		},
		size: {
			value: {
				min: 20,
				max: 100,
			},
		},
		move: {
			enable: true,
			speed: {
				min: 0.1,
				max: 1,
			},
		},
	},
	interactivity: {
		events: {
			onHover: {
				enable: false,
				mode: 'bubble',
			},
		},
		modes: {
			grab: {
				distance: 400,
				links: {
					opacity: 1,
				},
			},
			bubble: {
				distance: 250,
				size: 0,
				duration: 2,
				opacity: 0,
			},
			repulse: {
				distance: 400,
				duration: 0.4,
			},
			push: {
				quantity: 4,
			},
			remove: {
				quantity: 2,
			},
		},
	},
	background: {
		color: '#232741',
	},
};
