<template>
<span 
  :class="['app-iconify anticon', $attrs.class, { spin: spin }]"
  :style="getWrapStyle">
  <IconifyIcon
    :icon="`ant-design:${icon}`"
    :inline="inline"
    :rotate="rotate">
  </IconifyIcon>
</span>
</template>
<script lang="ts">
import { defineComponent, CSSProperties, computed } from 'vue';
import { Icon as IconifyIcon } from '@iconify/vue/dist/offline';
import { isString } from '@/utils/is';

export default defineComponent({
  name: 'Icon',
  components: { IconifyIcon },
  props: {
    // icon name
    icon: String,
    // icon color
    color: String,
    // icon size
    size: {
      type: [String, Number],
      default: 16,
    },
    spin: Boolean,
    inline: {
      type: Boolean,
      default: true,
    },
    rotate: [String, Number]
  },
  setup(props) {
    const getWrapStyle = computed((): CSSProperties => {
      const { size, color } = props;
      let fs = size;
      if (isString(size)) {
        fs = parseInt(size + '', 10);
      }

      return {
        fontSize: `${fs}px`,
        color: color,
        display: 'inline-flex',
      };
    });

    return { getWrapStyle };
  },
});
</script>
<style lang="less">
.app-iconify {
  &.spin {
    svg {
      animation: loadingCircle 1s infinite linear;
    }
  }
}
</style>
