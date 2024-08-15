//import { nodeResolve } from '@rollup/plugin-node-resolve';
import copy from 'rollup-plugin-copy';
//import css from 'rollup-plugin-import-css';

export default [
	{
		input: './src/client/js/application.js',
		output: {
			file: './build/client/js/application.js',
			format: 'esm'
		},
		plugins: [
			//css(),
			//nodeResolve(),
			copy({
				copyOnce: true,
				targets: [
					{src: 'src/client/index.html', dest: 'build/client/'},
				]
			}),
		],
	},
];
