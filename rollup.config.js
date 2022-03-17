import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'

const packageCoreJson = require('./packages/core/package.json')

const shared = {
  external: ['react', 'react-dom', 'react-hook-form', 'react-native'],
  plugins: [peerDepsExternal(), resolve({}), commonjs(), typescript({ useTsconfigDeclarationDir: true })],
}

export default [
  {
    input: './packages/core/src/index.ts',
    output: [
      {
        file: packageCoreJson.main,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: packageCoreJson.module,
        format: 'esm',
        sourcemap: true,
      },
    ],
    ...shared,
  },
  // {
  //   input: 'packages/test/index.ts',
  //   output: {
  //     file: 'lib/test/index.js',
  //     format: 'cjs',
  //     sourcemap: true,
  //   },
  // },
]
