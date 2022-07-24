import replace from '@rollup/plugin-replace';
import { defineConfig } from 'rollup';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';

export default defineConfig({
  input: ['src/index.ts'],
  output: {
    sourcemap: true,
    dir: 'lib',
    format: 'esm',
  },
  external: ['react'],
  plugins: [
    replace({
      preventAssignment: true,
      values: {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      },
    }),
    commonjs(),
    nodeResolve({ preferBuiltins: true }),
    typescript(),
  ],
});
