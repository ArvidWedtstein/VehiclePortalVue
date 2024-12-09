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
  <ol role="list" class="rounded-md border border-neutral flex mt-2">
    <li
      class="relative flex flex-1"
      v-for="(step, stepIndex) in steps"
      :key="`step-${stepIndex}`"
    >
      <button
        type="button"
        class="group flex w-full items-center"
        @click="modelValue = stepIndex"
      >
        <span class="flex items-center ps-6 pe-6 p-4 text-sm font-medium">
          <span
            class="flex w-10 h-10 shrink-0 items-center justify-center rounded-full transition group-hover:border-primary"
            :class="{
              'bg-primary': modelValue > stepIndex,
              'border-2 border-neutral': modelValue < stepIndex,
              'border-2 border-primary': modelValue === stepIndex,
            }"
          >
            <svg
              v-if="modelValue > stepIndex"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              aria-hidden="true"
              class="w-6 h-6 fill-current text-primary-content"
            >
              <path
                fill-rule="evenodd"
                d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z"
                clip-rule="evenodd"
              />
            </svg>
            <span
              v-else
              :class="[modelValue >= stepIndex ? 'text-primary' : '']"
              >{{ stepIndex + 1 }}</span
            >
          </span>
          <span
            class="ml-4 text-sm font-medium group-hover:text-primary"
            :class="[modelValue >= stepIndex ? 'text-primary' : '']"
          >
            {{ step }}
          </span>
        </span>
      </button>
      <div
        v-if="stepIndex !== steps.length - 1"
        aria-hidden="true"
        class="absolute top-0 right-0 h-full w-5 block"
      >
        <svg
          fill="none"
          viewBox="0 0 22 80"
          preserveAspectRatio="none"
          class="w-full h-full text-neutral"
        >
          <path
            d="M0 -2L20 40L0 82"
            class="stroke-current"
            vector-effect="non-scaling-stroke"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </li>
  </ol>

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
