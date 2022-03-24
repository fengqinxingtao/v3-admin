<template>
  <Footer class="layout-footer">
    <p>
      Copyright &copy; <a href="http://www.dongcai.com" target="_blank">贵州东彩供应链科技有限公司</a>, All Rights
      Reserved.
    </p>
    <p>智慧生态牧业 ● 金融科技创新</p>
  </Footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Layout } from 'ant-design-vue';

export default defineComponent({
  name: 'LayoutFooter',
  components: { Footer: Layout.Footer },
});
</script>

<style scoped lang="less">
.layout-footer {
  padding: 20px 50px;
  font-size: 12px;
  color: #ccc;
  text-align: center;

  a {
    color: #666666;
  }

  p {
    margin-bottom: 6px;
  }

  p:last-child {
    margin-bottom: 0;
  }
}
</style>
