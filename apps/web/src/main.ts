import 'unfonts.css';
import 'vuetify/styles';
import App from './App.vue';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from '@/shared/router/index.ts';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';
import { createRulesPlugin, createVuetify } from 'vuetify';
import { en, pt } from 'vuetify/locale';
import {
  fluxo30Dark,
  fluxo30Defaults,
  fluxo30Light,
} from '@/shared/theme/fluxo30Theme.ts';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const app = createApp(App);
const vuetify = createVuetify({
  components,
  defaults: fluxo30Defaults,
  directives,
  icons: { aliases, defaultSet: 'mdi', sets: { mdi } },
  locale: { fallback: 'en', locale: 'pt', messages: { en, pt } },
  theme: {
    defaultTheme: 'fluxo30Light',
    themes: { fluxo30Dark, fluxo30Light },
  },
});

app.use(createPinia());
app.use(vuetify);
app.use(createRulesPlugin({}, vuetify.locale));
app.use(router);

app.mount('#app');
