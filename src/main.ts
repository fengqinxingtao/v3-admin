import { createApp } from 'vue';
import App from './App.vue';
import { Button, Input } from 'ant-design-vue';
if (import.meta.env.DEV) {
  import('ant-design-vue/dist/antd.less');
}
import './design/index.less';

import router from '@/router';
import store from '@/store';

const app = createApp(App);
app.use(router).use(store);
app.use(Input).use(Button);
app.mount('#app');
