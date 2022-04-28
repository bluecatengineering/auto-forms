module.exports = {
	presets: [['@babel/react', {useBuiltIns: true, runtime: 'automatic'}]],
	env: {
		test: {
			sourceMaps: 'both',
			presets: [['@babel/env', {loose: true, targets: {node: true}}]],
		},
		production: {
			presets: [['@babel/env', {loose: true, modules: false, targets: {chrome: '69', firefox: '61'}}]],
		},
	},
};
