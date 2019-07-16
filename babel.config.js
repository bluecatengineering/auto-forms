module.exports = {
	presets: [['@babel/react', {useBuiltIns: true}]],
	env: {
		test: {
			sourceMaps: 'both',
			presets: [['@babel/env', {loose: true, targets: {node: true}}], ['@babel/react', {useBuiltIns: true}]],
		},
		es5: {
			presets: [
				[
					'@babel/env',
					{
						loose: true,
						modules: false,
						useBuiltIns: 'usage',
						corejs: 3,
						targets: {ie: '11'},
					},
				],
			],
		},
		es6: {
			presets: [
				[
					'@babel/env',
					{
						loose: true,
						modules: false,
						useBuiltIns: false,
						targets: {chrome: '69', firefox: '61'},
					},
				],
			],
		},
	},
};
