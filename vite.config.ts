import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  return {
    base: command === 'serve' ? '' : '/leafletjsExample/nearbyPowerBank/',
    plugins: [vue()],
    resolve: {
      alias: [{ find: '@', replacement: resolve(__dirname, 'src') }]
    }
  };
});
