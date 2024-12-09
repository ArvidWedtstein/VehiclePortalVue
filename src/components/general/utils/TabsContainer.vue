<script setup lang="ts">
import { ref } from 'vue';

type Props = {
  tabs?: string[];
  variant?: 'default' | 'boxed' | 'lifted' | 'bordered';
  containerClass?: string;
};

const props = withDefaults(defineProps<Props>(), {
  tabs: () => [],
  variant: 'default',
});

const emit = defineEmits<{
  (e: 'onTabChange', tab: string): void;
}>();

const activeTab = ref<number>(0);

const handleTabChange = (tabIndex: number) => {
  if (activeTab.value === tabIndex) return;

  activeTab.value = tabIndex;
  emit('onTabChange', props.tabs[tabIndex]);
};
</script>

<template>
  <div class="w-full">
    <div
      class="tabs w-full"
      :class="{
        'tabs-boxed': variant === 'boxed',
        'tabs-lifted': variant === 'lifted',
        'tabs-bordered': variant === 'bordered',
      }"
    >
      <button
        v-for="(tab, tabIndex) in tabs"
        :key="tabIndex"
        type="button"
        role="tab"
        class="tab"
        :class="{
          'tab-active': tabIndex === activeTab,
        }"
        @click="handleTabChange(tabIndex)"
      >
        <slot name="tab" :tab="tab" :active="tabIndex === activeTab">{{
          tab
        }}</slot>
      </button>
    </div>

    <template v-for="(tab, tabIndex) in tabs" :key="`tab-panel-${tabIndex}`">
      <div
        :id="`tab-${tab}`"
        class="tab-content mt-2"
        :class="[
          {
            block: tabIndex === activeTab,
          },
          containerClass,
        ]"
      >
        <slot :name="tab.toLowerCase()">Tab "{{ tab }}"</slot>
      </div>
    </template>
  </div>
</template>
