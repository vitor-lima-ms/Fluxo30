import 'unfonts.css';
import 'vuetify/styles';
import App from './App.vue';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createVuetify } from 'vuetify';
import router from '@/shared/router/index.ts';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';
import { en, pt } from 'vuetify/locale';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(
  createVuetify({
    components,
    directives,
    icons: { aliases, defaultSet: 'mdi', sets: { mdi } },
    locale: { fallback: 'en', locale: 'pt', messages: { en, pt } },
  }),
);

app.mount('#app');
