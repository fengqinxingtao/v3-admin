import { createApp } from 'vue';
import App from './App.vue';
import { Button, Input } from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import '@/design/index.less';

import router from '@/router';
import store from '@/store';

const app = createApp(App);
app.use(router).use(store);
app.use(Input).use(Button);
app.mount('#app');
