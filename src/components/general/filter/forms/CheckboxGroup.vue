<script setup lang="ts">
type Props = {
  options: Array<string>;
  selected: Array<string>;
};

withDefaults(defineProps<Props>(), {
  options: () => [],
});

defineEmits<{
  (e: 'change', option: string): void;
}>();
</script>

<template>
  <label
    v-for="option in options"
    :key="option"
    class="label gap-3 cursor-pointer w-full"
  >
    <input
      type="checkbox"
      :checked="selected.includes(option)"
      class="checkbox checked:checkbox-accent"
      @change="$emit('change', option)"
    />
    <span class="label-text grow">{{ option }}</span>
  </label>
</template>
