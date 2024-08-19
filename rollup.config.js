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
			nodeResolve(),
			copy({
				copyOnce: true,
				targets: [
					{ src: 'src/client/index.html', dest: 'build/client/' },
					{ src: 'src/client/js/demos/', dest: 'build/client/js/' },
					{ src: 'src/client/js/source1.js', dest: 'build/client/js/' },
					{ src: 'src/client/js/source2.js', dest: 'build/client/js/' },
					{ src: 'src/client/js/utils.js', dest: 'build/client/js/' },
					{ src: 'src/client/json/', dest: 'build/client/' },
				]
			}),
		],
	},
];
