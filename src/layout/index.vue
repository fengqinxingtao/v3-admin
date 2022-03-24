<template>
  <Layout>
    <RouterView></RouterView>

    <LayoutFooter />
  </Layout>
</template>

<script setup lang="ts">
import { Layout } from 'ant-design-vue';
import LayoutFooter from './footer/index.vue';
</script>

<style scoped></style>
