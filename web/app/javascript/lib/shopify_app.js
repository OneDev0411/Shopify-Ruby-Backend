import {PostgreSQLSessionStorage} from '@shopify/shopify-app-session-storage-postgresql';

var data = document.getElementById('shopify-app-init').dataset;
var AppBridge = window['app-bridge'];
var createApp = AppBridge.default;


const sessionDb = new PostgreSQLSessionStorage.withCredentials(
  process.env.POSTGRES_HOST,
  process.env.POSTGRES_DB,
  process.env.POSTGRES_USER,
  process.env.POSTGRES_PASSWORD
);

window.app = createApp({
  apiKey: data.apiKey,
  host: data.host,
  SESSION_STORAGE: sessionDb
});

var actions = AppBridge.actions;
var TitleBar = actions.TitleBar;
TitleBar.create(app, {
  title: data.page,
});

