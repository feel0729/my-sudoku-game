// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import store from './store';
import './assets/styles.css'; // 引入全局樣式

const app = createApp(App);

app.use(store);

app.mount('#app');
