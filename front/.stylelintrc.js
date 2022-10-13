module.exports = {
	processors: [
		[
    	'@mapbox/stylelint-processor-arbitrary-tags',
			{
				fileFilterRegex: [/\.vue$/],
			},
		],
	],
	extends: 'stylelint-config-standard-scss',
	rules: {
		'no-empty-first-line': null,
		'no-empty-source': null,
		'selector-class-pattern': [
			'^([a-z][a-z0-9]*)(-[a-z0-9]+)*((__([a-z][a-z0-9]*)(-[a-z0-9]+)*)?(--([a-z][a-z0-9]*)(-[a-z0-9]+)*$)?)',
			{
				message: 'Expected class selector to be BEM',
			},
		],
	},
};
