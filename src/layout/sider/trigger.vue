<template>
  <div @click.stop="toggleCollapsed">
    <DoubleRightOutlined v-if="siderCollapsed" />
    <DoubleLeftOutlined v-else />
  </div>
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue';
import { DoubleRightOutlined, DoubleLeftOutlined } from '@ant-design/icons-vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'SiderTrigger',
  components: { DoubleRightOutlined, DoubleLeftOutlined },
  setup() {
    const store = useStore();
    const siderCollapsed = computed(() => store.getters['app/siderCollapsed']);
    const toggleCollapsed = function () {
      store.commit('app/toggleSidebar');
    };

    return {
      siderCollapsed,
      toggleCollapsed,
    };
  },
});
</script>
