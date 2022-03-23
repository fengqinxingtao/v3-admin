<template>
  <div class="error-page">
    <img class="error-img" src="@/assets/exception-404.png" />
    <p class="tip">请检查您输入的网址是否正确，或单击下面的按钮返回首页</p>
    <Button type="primary" @click="goHome">返回首页</Button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

import { Button } from 'ant-design-vue';
import { PageEnum } from '@/enums/app';

const router = useRouter();

function goHome() {
  router.replace(PageEnum.BASE_HOME);
}
</script>

<style lang="less" scoped>
.error-page {
  text-align: center;
  padding-top: 12vh;

  .error-img {
    width: 500px;
    max-width: 80vw;
  }

  .tip {
    margin-top: 20px;
    margin-bottom: 50px;
    font-size: 16px;
    color: #333;
    padding: 0 20px;
  }
}
</style>
