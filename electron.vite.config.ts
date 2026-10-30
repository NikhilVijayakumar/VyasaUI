import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';

const packageInfo = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf8')) as { version: string };

export default defineConfig({
  main: { plugins: [externalizeDepsPlugin()], build: { rollupOptions: { input: resolve(__dirname, 'src/main/index.ts') } } },
  preload: { plugins: [externalizeDepsPlugin()], build: { rollupOptions: { input: { index: resolve(__dirname, 'src/main/preload.ts') } } } },
  renderer: { plugins: [react()], root: 'src/renderer', define: { __APP_VERSION__: JSON.stringify(packageInfo.version) }, build: { rollupOptions: { input: resolve(__dirname, 'src/renderer/index.html') } } }
});
