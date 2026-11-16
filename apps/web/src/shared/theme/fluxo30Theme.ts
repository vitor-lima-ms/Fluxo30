import type { ThemeDefinition } from 'vuetify';

const fluxo30Light: ThemeDefinition = {
  colors: {
    background: '#f4efe6',
    error: '#8f2f24',
    filete: '#d9d0c4',
    gasto: '#b85c38',
    info: '#1c1916',
    'on-background': '#1c1916',
    'on-error': '#f4efe6',
    'on-filete': '#1c1916',
    'on-gasto': '#f4efe6',
    'on-info': '#f4efe6',
    'on-primary': '#f4efe6',
    'on-receita': '#f4efe6',
    'on-success': '#f4efe6',
    'on-surface': '#1c1916',
    'on-surface-variant': '#1c1916',
    'on-warning': '#f4efe6',
    primary: '#c43c2c',
    receita: '#2a4d8f',
    success: '#3d5a3d',
    surface: '#f4efe6',
    'surface-bright': '#f7f3ec',
    'surface-light': '#ebe4d8',
    'surface-variant': '#d9d0c4',
    warning: '#c43c2c',
  },
  dark: false,
  variables: { 'border-radius-root': '4px' },
};

const fluxo30Dark: ThemeDefinition = {
  colors: {
    background: '#1a1612',
    error: '#8f2f24',
    filete: '#3d362e',
    gasto: '#b85c38',
    info: '#f4efe6',
    'on-background': '#f4efe6',
    'on-error': '#f4efe6',
    'on-filete': '#f4efe6',
    'on-gasto': '#f4efe6',
    'on-info': '#1a1612',
    'on-primary': '#f4efe6',
    'on-receita': '#f4efe6',
    'on-success': '#f4efe6',
    'on-surface': '#f4efe6',
    'on-surface-variant': '#f4efe6',
    'on-warning': '#f4efe6',
    primary: '#c43c2c',
    receita: '#2a4d8f',
    success: '#3d5a3d',
    surface: '#24201b',
    'surface-bright': '#2c2721',
    'surface-light': '#2c2721',
    'surface-variant': '#3d362e',
    warning: '#c43c2c',
  },
  dark: true,
  variables: { 'border-radius-root': '4px' },
};

const fluxo30Defaults = {
  VBtn: {
    elevation: 0,
    rounded: 'md',
    style: 'text-transform: none;',
    variant: 'flat',
  },
  VCard: { elevation: 0, rounded: 'md', variant: 'flat' },
  VTextField: { elevation: 0, rounded: 'md', variant: 'outlined' },
};

export { fluxo30Dark, fluxo30Defaults, fluxo30Light };
