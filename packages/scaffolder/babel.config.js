module.exports = {
	presets: [
    '@babel/preset-typescript',
		[
			'@babel/preset-env',
			{
				exclude: [ '@babel/plugin-proposal-dynamic-import' ],
				targets: {
					node: 16,
				},
			},
		],
	],
	ignore: [ '**/*.d.ts' ],
};
