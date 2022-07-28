import { defineConfig } from 'rollup';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';

export default defineConfig({
  input: ['src/index.ts'],
  output: [
    {
      sourcemap: true,
      dir: 'lib/esm',
      format: 'esm',
    },
    {
      sourcemap: true,
      dir: 'lib/cjs',
      format: 'cjs',
    },
  ],
  external: ['react'],
  plugins: [
    commonjs(),
    nodeResolve({ preferBuiltins: true }),
    typescript({ useTsconfigDeclarationDir: true }),
  ],
});
