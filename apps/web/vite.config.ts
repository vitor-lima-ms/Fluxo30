import vue from '@vitejs/plugin-vue';
import ViteFonts from 'unplugin-fonts/vite';
import { defineConfig } from 'vite';
import vueDevTools from 'vite-plugin-vue-devtools';
import { fileURLToPath, URL } from 'node:url';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    ViteFonts({
      fontsource: {
        families: [
          {
            name: 'Roboto',
            styles: ['normal', 'italic'],
            weights: [100, 300, 400, 500, 700, 900],
          },
        ],
      },
    }),
    vue(),
    vueDevTools(),
  ],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
});
