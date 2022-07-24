import replace from '@rollup/plugin-replace';
import { defineConfig } from 'rollup';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import html from '@rollup/plugin-html';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import postcss from 'rollup-plugin-postcss';

const isDevMode = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined;

export default defineConfig({
  input: ['src/index.tsx'],
  output: {
    sourcemap: true,
    dir: 'build',
    format: 'iife',
  },
  plugins: [
    replace({
      preventAssignment: true,
      values: {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      },
    }),
    commonjs(),
    nodeResolve({ preferBuiltins: true }),
    postcss(),
    typescript(),
    html(),
    isDevMode &&
      serve({
        open: false,
        port: 3000,
        contentBase: ['build'],
      }),
    isDevMode &&
      livereload({
        watch: ['build'],
      }),
  ],
});
