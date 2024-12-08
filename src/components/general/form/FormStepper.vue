<script setup lang="ts">
type Props = {
  steps?: string[];
  direction?: 'vertical' | 'horizontal';
};

withDefaults(defineProps<Props>(), {
  steps: () => [],
  direction: 'horizontal',
});

const modelValue = defineModel<number>({
  required: false,
  default: 0,
});

defineExpose({
  currentStep: modelValue,
});
</script>

<template>
  <ul
    class="steps w-full"
    :class="[
      direction === 'horizontal' ? 'steps-horizontal' : 'steps-vertical',
    ]"
  >
    <li
      v-for="(step, stepIndex) in steps"
      :key="stepIndex"
      class="step"
      :class="{ 'step-primary': modelValue >= stepIndex }"
    >
      <button type="button" @click="modelValue = stepIndex">
        {{ step }}
      </button>
    </li>
  </ul>

  <div class="carousel w-full">
    <template
      v-for="(step, stepIndex) in steps"
      :key="`step-panel-${stepIndex}`"
    >
      <div
        v-if="modelValue === stepIndex"
        :id="`step-${step}`"
        class="carousel-item w-full"
      >
        <slot :name="`step-${step.toLowerCase()}`">Step "{{ step }}"</slot>
      </div>
    </template>
  </div>
</template>
