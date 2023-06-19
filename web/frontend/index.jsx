
import ReactDOM from "react-dom";
import { Provider } from 'react-redux'
import App from "./App";
import store from "./store/store";

import { createRoot } from 'react-dom/client';

const container = document.getElementById('app');
const root = createRoot(container);
root.render(
  <Provider store={store}>
    <App tab="home" />
  </Provider>);

