<template>
  <div>页面宽度：{{ width }} </div>
  <div>页面高度：{{ height }} </div>
  <div>计数器：{{ counter }} </div>
</template>

<script setup lang="ts">
import { useWindowSize, useInterval } from '@vueuse/core';

const { width, height } = useWindowSize({
  initialWidth: 888,
  initialHeight: 555,
});

const counter = useInterval(1000);
</script>

<style scoped></style>
