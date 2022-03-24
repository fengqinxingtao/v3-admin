<template>
  <Layout>
    <RouterView></RouterView>
    <LayoutSider />
    <LayoutFooter />
  </Layout>
</template>

<script setup lang="ts">
import { Layout } from 'ant-design-vue';
import LayoutFooter from './footer/index.vue';
import LayoutSider from './sider/index.vue';
</script>

<style scoped></style>
