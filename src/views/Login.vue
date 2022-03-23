<template>
  <div class="login-page">
    <div class="login-wrap clearfix">
      <div class="sys-short-name">运营管理系统</div>
      <div class="login-l">
        <img class="logo" src="@/assets/logo.png" alt="运营管理系统" />
      </div>
      <div class="login-r">
        <p class="login-title">用户登录<span>USER LOGIN</span></p>
        <Form ref="loginFormRef" :model="loginForm" :rules="rules" class="login-form">
          <FormItem name="username">
            <a-input v-model:value="loginForm.username" placeholder="请输入账户" :maxlength="20" @blur="getCountDown">
              <template #prefix> <UserOutlined /> </template>
            </a-input>
          </FormItem>
          <FormItem name="password">
            <a-input-password v-model:value="loginForm.password" placeholder="请输入密码" :maxlength="32">
              <template #prefix> <LockOutlined /> </template>
            </a-input-password>
          </FormItem>
          <FormItem name="captcha">
            <a-input
              v-model:value="loginForm.captcha"
              placeholder="图形验证码"
              :maxlength="4"
              @keyup.enter="!enableSmsCode ? login() : () => {}"
            >
              <template #prefix><SafetyOutlined /></template>
              <template #addonAfter>
                <img class="code-img" :src="codeImgUrl" @click="getCodeImg" />
              </template>
            </a-input>
          </FormItem>
          <FormItem v-if="enableSmsCode" name="verifyCode">
            <a-input
              v-model:value="loginForm.verifyCode"
              placeholder="短信验证码"
              :maxlength="6"
              @keyup.enter="login()"
            >
              <template #prefix> <SafetyOutlined /> </template>
              <template #addonAfter>
                <a-button
                  type="primary"
                  shape="round"
                  :disabled="count !== 0 || loginForm.captcha.length < 4"
                  @click="getPhoneVerifyCode"
                  >{{ count == 0 ? '获取验证码' : `重新获取(${count}s)` }}</a-button
                >
              </template>
            </a-input>
          </FormItem>
        </Form>
        <a-button class="login-btn" type="primary" :loading="loadingSubmit" @click="login()">登录</a-button>
      </div>
    </div>

    <!-- <Footer fixed></Footer> -->
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, unref } from 'vue';
import { Form, FormItem } from 'ant-design-vue';
import { UserOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons-vue';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import sha1 from 'crypto-js/sha1';
import { Device } from '@/utils/storage';
import http from '@/utils/http';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { useIntervalFn } from '@vueuse/core';

const codeImgUrl = ref('');
const loginFormRef = ref();
const loginForm = reactive({
  appCode: import.meta.env.VITE_APP_CODE,
  captchaId: null, // 验证码ID
  deviceId: '', // 设备指纹： 设备唯一ID
  deviceType: import.meta.env.VITE_DEVICE_TYPE, // 设备类型
  username: null,
  password: '',
  captcha: '', // 验证码
  verifyCode: null,
});
const count = ref(0);
const { pause: stopTimer, resume: startTimer } = useIntervalFn(
  () => {
    count.value--;
    if (unref(count) <= 0) {
      stopTimer();
    }
  },
  1000,
  {
    immediate: false,
  },
);
const enableSmsCode = ref(false);
const loadingSubmit = ref(false);

const rules = {
  username: { required: true, message: '请输入账号', trigger: 'blur' },
  password: { required: true, message: '请输入密码', trigger: 'blur' },
  verifyCode: { required: true, message: '请输入短信验证码', trigger: 'blur' },
  captcha: { required: true, message: '请输入图形验证码', trigger: 'blur' },
};

async function getDeviceId() {
  const fpPromise = FingerprintJS.load();
  const fp = await fpPromise;
  const result = await fp.get();
  loginForm.deviceId = result.visitorId;
  Device.set(result.visitorId);
}
function getCodeImg() {
  http.get('/authentication/captcha/id').then(({ data }) => {
    codeImgUrl.value = `/authentication/captcha/image?captchaId=${data}&t=${new Date().getTime()}`;
    loginForm.captchaId = data;
  });
}
// 获取是否启动短信验证的状态
function getVerifyCodeEnable() {
  http.get('/authentication/smsCode/hasEnable', { appCode: loginForm.appCode }).then((res) => {
    enableSmsCode.value = res.data.enable;
    if (unref(enableSmsCode)) {
      getCountDown();
    }
  });
}
// 获取短信验证码
function getPhoneVerifyCode() {
  if (unref(count) !== 0 || loginForm.captcha == null || loginForm.captcha.length < 4) return;

  http
    .post('/authentication/smsCode/send', {
      appCode: loginForm.appCode,
      username: loginForm.username,
      captcha: loginForm.captcha,
      captchaId: loginForm.captchaId,
    })
    .then((res) => {
      count.value = res.data.retry;
      startTimer();
    })
    .catch((err) => {
      if (err.code === 4005) {
        getCodeImg();
      }
    });
}

function getCountDown() {
  if (!unref(enableSmsCode)) return;
  if (!unref(loginForm.username)) return;

  // 获取验证码剩余时间
  http
    .post('/authentication/smsCode/retry', {
      appCode: loginForm.appCode,
      username: loginForm.username,
    })
    .then((res) => {
      if (res.data) {
        count.value = res.data.retry;
        startTimer();
      }
    });
}

const store = useStore();
const router = useRouter();
function login() {
  if (unref(loadingSubmit)) return;

  loginFormRef.value.validate().then(() => {
    const params = Object.assign({}, loginForm);
    params.password = '$FHA' + sha1(params.password);
    loadingSubmit.value = true;
    http
      .post('/authentication/login', params)
      .then((res) => {
        store.dispatch('setLoginInfo', res.data);
        router.replace('/dashboard');
      })
      .catch((err) => {
        if (err.code && err.code === 4005) {
          // 验证码错误
          getCodeImg();
        }
      })
      .finally(() => {
        loadingSubmit.value = false;
      });
  });
}

onMounted(() => {
  getDeviceId();
  getCodeImg();
  getVerifyCodeEnable();
});

onUnmounted(() => {
  stopTimer();
});
</script>

<style lang="less" scoped>
.login-page {
  box-sizing: border-box;
  position: relative;
  background: url(@/assets/login-bg.svg) no-repeat;
  width: 100vw;
  height: 100vh;
}
.login-wrap {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -56%);
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.15);
  background-color: #ffffff;
  border-radius: 5px;
  overflow: hidden;
  display: flex;
  height: 480px;
  .sys-short-name {
    position: absolute;
    top: 0;
    right: 20px;
    background: @primary-color;
    font-size: 16px;
    color: #ffffff;
    padding: 4px 12px 6px;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
  }
  .login-l {
    width: 300px;
    background-image: url(@/assets/login-thumb.svg);
    background-size: cover;
    background-position: center;
    text-align: center;
    flex-shrink: 0;
    .logo {
      margin-top: 32px;
      width: 88px;
      height: 88px;
    }
  }
  .login-r {
    width: 400px;
    padding: 20px 36px;
    box-sizing: border-box;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    .login-title {
      color: #999999;
      font-size: 16px;
      font-weight: bold;
      flex-shrink: 0;
      span {
        font-weight: normal;
        font-style: italic;
        font-size: 12px;
        margin-left: 8px;
        vertical-align: bottom;
      }
    }
    .login-btn {
      flex-shrink: 0;
      width: 100%;
      height: 36px;
      font-size: 16px;
      font-weight: bold;
    }
  }
}
</style>
<style lang="less">
.login-page {
  .login-form {
    margin-top: 40px;
    flex: 1;
    .ant-input-affix-wrapper {
      padding: 5px 10px;
      height: 36px;
    }
    .ant-input {
      font-size: 16px;
      line-height: 1.2;
    }
    .ant-input-prefix {
      margin-right: 8px;
      .anticon {
        font-size: 18px;
      }
    }
    .ant-input-group-addon {
      border: none;
      background: none;
      padding-left: 12px;
      padding-right: 0;
      text-align: right;
      .ant-btn {
        height: 36px;
        width: 108px;
        padding: 4px 8px;
        box-sizing: border-box;
      }
      .code-img {
        height: 36px;
        width: 108px;
        border-radius: 3px;
        cursor: pointer;
      }
    }
  }
}
</style>
