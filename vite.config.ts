import react from '@vitejs/plugin-react'
import nodePolyfills from 'rollup-plugin-polyfill-node'
import { defineConfig } from 'vite'
import macrosPlugin from 'vite-plugin-babel-macros'
import checker from 'vite-plugin-checker'
import viteTsconfigPaths from 'vite-tsconfig-paths'

const MODE = process.env.NODE_ENV
const development = MODE === 'development'

// import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    development &&
      nodePolyfills({
        include: ['node_modules/**/*.js', new RegExp('node_modules/.vite/.*js')],
        //@ts-ignore
        http: true,
        crypto: true,
      }),
    macrosPlugin(),
    react({
      babel: {
        // Use .babelrc files, necessary to use LinguiJS CLI
        babelrc: true,
      },
    }),
    viteTsconfigPaths(),
    checker({ typescript: true }),
  ],
  worker: {
    plugins: [viteTsconfigPaths()],
  },
  resolve: {
    alias: {
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
      assert: 'assert',
      '@socket.tech/ll-core': require.resolve('@socket.tech/ll-core'),
      '@socket.tech/ll-core-v2': require.resolve('@socket.tech/ll-core-v2'),
    },
  },
  build: {
    outDir: 'build',
    rollupOptions: {
      //@ts-ignore
      plugins: [nodePolyfills({ crypto: true, http: true })],
      output: {
        manualChunks: {
          '@ethersproject': [
            '@ethersproject/bignumber',
            '@ethersproject/units',
            '@ethersproject/contracts',
            '@ethersproject/abi',
            '@ethersproject/abstract-provider',
            '@ethersproject/providers',
            '@ethersproject/abstract-signer',
          ],
          '@web3-onboard': [
            '@web3-onboard/injected-wallets',
            '@web3-onboard/react',
            '@web3-onboard/walletconnect',
            '@web3-onboard/metamask',
            '@web3-onboard/bitget',
            '@web3-onboard/okx',
          ],
        },
      },
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  server: {
    port: 3000,
  },
})
