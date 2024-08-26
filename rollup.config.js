import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import copy from 'rollup-plugin-copy';
import css from 'rollup-plugin-import-css';

const isExamples = process.env.BUILD === 'examples';

export default [
	{
		input: './src/client/js/application.js',
		output: {
			file: './build/client/js/application.js',
			format: 'esm'
		},
		plugins: [
			css(),
			json({
				compact: true,
			}),
			nodeResolve(),
			copy({
				copyOnce: true,
				targets: [
					{ src: 'src/client/index.html', dest: 'build/client/' },
					{ src: 'src/client/js/demos/', dest: 'build/client/js/' },
					{ src: 'src/client/json/fonts/', dest: 'build/client/' },
				]
			}),
		],
	},
];
