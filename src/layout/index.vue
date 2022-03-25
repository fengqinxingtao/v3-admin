<template>
  <Layout>
    <RouterView></RouterView>
    <LayoutHeader />
    <LayoutSider />
    <LayoutFooter />
  </Layout>
</template>

<script setup lang="ts">
import { Layout } from 'ant-design-vue';
import LayoutFooter from './footer/index.vue';
import LayoutSider from './sider/index.vue';
import LayoutHeader from './header/index.vue';
</script>

<style scoped></style>
