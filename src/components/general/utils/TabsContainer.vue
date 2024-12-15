<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRouter, type RouteRecordNameGeneric } from 'vue-router';

type Props = {
  tabs?: string[];
  variant?: 'default' | 'boxed' | 'lifted' | 'bordered';
  containerClass?: string;
  /**
   * Tabs will route to url
   */
  urlMode?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  tabs: () => [],
  variant: 'default',
  urlMode: false,
});

const emit = defineEmits<{
  (e: 'onTabChange', tab: string): void;
}>();

const router = useRouter();

const activeTab = ref<number>(0);

const handleTabChange = (tabIndex: number) => {
  if (activeTab.value === tabIndex) return;

  activeTab.value = tabIndex;
  emit('onTabChange', props.tabs[tabIndex]);
};

const setActiveTabFromUrl = (
  name?: string | RouteRecordNameGeneric,
  firstRender: boolean = false,
) => {
  const matchedTabIndex = props.tabs.findIndex(
    tab => tab.toLowerCase() === name,
  );

  if (
    matchedTabIndex === -1 &&
    firstRender &&
    !props.tabs.some(tab =>
      router.currentRoute.value.path.includes(tab.toLowerCase()),
    )
  ) {
    activeTab.value = 0;

    router.replace({
      name: props.tabs[0].toLowerCase(),
      params: { ...router.currentRoute.value.params },
    });
    return;
  }

  handleTabChange(matchedTabIndex);
};

watch(
  () => router.currentRoute.value.name,
  newId => {
    if (!props.urlMode) return;

    setActiveTabFromUrl(newId);
  },
);

onMounted(() => {
  if (!props.urlMode) return;

  setActiveTabFromUrl(router.currentRoute.value.name, true);
});
</script>

<template>
  <div class="flex flex-col gap-2 w-full">
    <div
      class="tabs w-full"
      :class="{
        'tabs-boxed': variant === 'boxed',
        'tabs-lifted': variant === 'lifted',
        'tabs-bordered': variant === 'bordered',
      }"
    >
      <component
        :is="urlMode ? 'RouterLink' : 'button'"
        v-for="(tab, tabIndex) in tabs"
        :key="tabIndex"
        type="button"
        role="tab"
        class="tab"
        :to="urlMode ? { name: tab.toLowerCase() } : {}"
        activeClass="tab-active"
        :class="{
          'tab-active': tabIndex === activeTab,
        }"
        @click="handleTabChange(tabIndex)"
      >
        <slot name="tab" :tab="tab" :active="tabIndex === activeTab">
          {{ tab }}
        </slot>
      </component>
    </div>

    <slot v-if="urlMode"></slot>

    <template v-else>
      <div
        v-for="(tab, tabIndex) in tabs"
        :key="`tab-panel-${tabIndex}`"
        :id="`tab-${tab}`"
        class="tab-content"
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
