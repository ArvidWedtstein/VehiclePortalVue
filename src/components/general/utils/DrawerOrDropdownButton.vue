<script setup lang="ts">
import { useBreakpoints } from '@/lib/composables/useBreakpoints';
import { ref, toRef } from 'vue';
import MobileDrawer from '../modal/MobileDrawer.vue';

const isMd = toRef(useBreakpoints(), 'isMd');

const drawerRef = ref<InstanceType<typeof MobileDrawer>>();

const toggleDropdown = () => {
  if (drawerRef.value?.isOpen) {
    drawerRef.value.close();
    return;
  }

  drawerRef.value?.open();
};
</script>

<template>
  <template v-if="isMd">
    <div class="dropdown">
      <div
        tabindex="0"
        role="button"
        class="btn btn-sm"
        @click="toggleDropdown"
      >
        <slot>Open</slot>
      </div>
      <ul
        tabindex="0"
        class="dropdown-content menu bg-base-200 rounded-box z-[1] w-52 p-2 shadow"
      >
        <slot name="options">
          <li><a>Item 1</a></li>
          <li><a>Item 2</a></li>
        </slot>
      </ul>
    </div>
  </template>

  <template v-else>
    <MobileDrawer ref="drawerRef" :direction="isMd ? 'left' : 'bottom'">
      <ul class="menu w-full p-0 [&_li>*]:rounded-none pt-4">
        <slot name="options">
          <li><a>Item 1</a></li>
          <li><a>Item 2</a></li>
        </slot>
      </ul>
    </MobileDrawer>

    <button type="button" class="btn btn-sm" @click="toggleDropdown">
      <slot>Open</slot>
    </button>
  </template>
</template>
