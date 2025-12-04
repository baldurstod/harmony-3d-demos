import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import copy from 'rollup-plugin-copy';
import css from 'rollup-plugin-import-css';
import typescript from '@rollup/plugin-typescript';
import wasm from '@rollup/plugin-wasm';

const isExamples = process.env.BUILD === 'examples';

export default [
	{
		input: './src/client/ts/application.ts',
		output: {
			file: './build/client/js/application.js',
			format: 'esm'
		},
		plugins: [
			css(),
			json({
				compact: true,
			}),
			wasm(
				{
					maxFileSize: 1000000
				}
			),
			typescript(),
			nodeResolve({
				dedupe: ['gl-matrix', 'harmony-ui', 'harmony-browser-utils'],
				extensions: ['.js', '.ts'],
			}),
			copy({
				copyOnce: true,
				targets: [
					{ src: 'src/client/index.html', dest: 'build/client/' },
					{ src: 'src/client/js/demos/', dest: 'build/client/js/' },
					{ src: 'src/client/json/fonts/', dest: 'build/client/json/' },
				]
			}),
		],
	},
];
