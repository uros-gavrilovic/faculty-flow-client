export const backgroundConfig = {
	key: 'faculty-flow',
	name: 'faculty-flow',
	fpsLimit: 60,
	particles: {
		number: {
			value: 7,
			density: {
				enable: false,
			},
		},
		color: {
			value: ['#2f8f6c', '#3aa27c', '#24785b', '#1c5f4a'],
		},
		shape: {
			type: 'circle',
		},
		opacity: {
			value: {
				min: 0.12,
				max: 0.25,
			},
			animation: {
				enable: false,
			},
		},
		size: {
			value: {
				min: 150,
				max: 300,
			},
		},
		move: {
			enable: true,
			speed: {
				min: 0.05,
				max: 0.3,
			},
			outModes: {
				default: 'out',
			},
		},
	},
	interactivity: {
		events: {
			onHover: {
				enable: false,
			},
		},
	},
	background: {
		color: '#0e3b31',
		image: 'linear-gradient(135deg, #1a5a47 0%, #0e3b31 45%, #0b3029 70%, #14503f 100%)',
	},
};
