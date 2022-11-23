import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import jsx from 'acorn-jsx'
import typescript from 'rollup-plugin-typescript2'

export default {
  input: './lib/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
    },
  ],
  external: ['react', 'react-dom', 'react-hook-form', 'react-native'],
  acornInjectPlugins: [jsx()],
  plugins: [peerDepsExternal(), resolve({}), commonjs(), typescript({ useTsconfigDeclarationDir: true })],
}
