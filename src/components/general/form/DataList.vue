<script setup lang="ts">
type Props = {
  id: string;
  options: string[];
};

withDefaults(defineProps<Props>(), {});
</script>

<template>
  <datalist :id="id">
    <option
      v-for="(option, optionIndex) in options"
      :key="optionIndex"
      :value="option"
    ></option>
  </datalist>
</template>
