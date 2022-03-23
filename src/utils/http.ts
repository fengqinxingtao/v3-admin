import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';
import { createVNode } from 'vue';
import { Modal, message as Message } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import store from '@/store';
import { Token, Device } from './storage';

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
  timeout: 15 * 1000,
  withCredentials: true,
});

instance.interceptors.request.use((config: AxiosRequestConfig) => {
  if (config.url && config.url.startsWith('/authentication')) {
    config.baseURL = '';
  }

  // token处理
  const deviceId = Device.get();
  const token = Token.get();
  deviceId && (config.headers!['Device-Id'] = deviceId);
  token && (config.headers!.Authorization = token);
  config.headers!['Device-Type'] = import.meta.env.VITE_DEVICE_TYPE;

  // FormData自动修改Content-Type
  if (config.data && config.data instanceof FormData) {
    config.headers!['Content-Type'] = 'multipart/form-data';
  }

  // Get请求添加时间戳，避免缓存
  if (config.method!.toUpperCase() === 'GET') {
    if (config.params == null) {
      config.params = {
        _t: Date.now(),
      };
    } else {
      config.params._t = Date.now();
    }
  }

  return config;
});

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    const { authorization } = response.headers;
    // 刷新token
    if (authorization) {
      Token.set(authorization);
    }
    const { data } = response;
    const { code, message } = data;
    if (code === 200) {
      return data;
    } else if (code === 4001 || code === 4008 || code === 200) {
      // 无效登录
      Modal.confirm({
        title: '退出登录',
        icon: createVNode(ExclamationCircleOutlined),
        content: '您登录已过期，请重新登录',
        okText: '确认',
        cancelText: '取消',
        onOk: function () {
          store.dispatch('user/resetToken');
          location.reload();
        },
      });
    } else if (code === 4999 && data.data) {
      // 系统停用
      window.location.replace(window.location.origin + '/' + data.data.url);
    } else if (message) {
      Message.error({
        key: 'GlobalHttpError',
        duration: 3 * 1000,
        content: message,
      });
    }
    return Promise.reject(data);
  },
  (error) => {
    switch (error.response.status) {
      case 401:
      case 403:
        logoutConfirm();
        break;
      case 404:
        httpError('未知请求资源');
        break;
      case 500:
        httpError('服务器错误');
        break;
      default:
        httpError('未知网络错误');
        break;
    }
  },
);

function logoutConfirm() {
  Modal.warning({
    title: '退出登录',
    content: '您登录已过期，请重新登录',
    icon: createVNode(ExclamationCircleOutlined),
    centered: true,
    closable: false,
    maskClosable: false,
    okText: '确定',
    onOk: function () {
      store.dispatch('user/resetToken');
      location.reload();
    },
  });
}

function httpError(tip: string) {
  Message.error({
    // key: 'GlobalHttpError',
    duration: 3,
    content: tip,
  });
}

export default {
  instance: instance,
  get: function (url: string, params?: any, config?: AxiosRequestConfig) {
    return instance.get(url, {
      params,
      ...config,
    });
  },
  post: function (url: string, data?: any, config?: AxiosRequestConfig) {
    return instance.post(url, data, config);
  },
  put: function (url: string, data?: any, config?: AxiosRequestConfig) {
    return instance.put(url, data, config);
  },
  delete: function (url: string, params?: any, config?: AxiosRequestConfig) {
    return instance.delete(url, {
      params,
      ...config,
    });
  },
};
