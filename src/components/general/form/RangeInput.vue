<template>
  <div class="range-slider" ref="sliderRef" @mousedown="handleTrackClick">
    <!-- Slider Track -->
    <div class="slider-track"></div>

    <!-- Highlighted Range -->
    <div
      class="slider-range"
      :style="{
        left: Array.isArray(ranges) ? Math.min(...ranges) : ranges + '%',
        width: rangeWidth + '%',
      }"
    ></div>

    <!-- Handles -->
    <!-- <div
      class="slider-thumb"
      :style="{ left: rangeLeft + '%' }"
      @mousedown.prevent="startDrag('from', 0)"
      @touchstart.prevent="startDrag('from', 0)"
    ></div>
    <div
      class="slider-thumb"
      :style="{ left: rangeRight + '%' }"
      @mousedown.prevent="startDrag('to', 1)"
      @touchstart.prevent="startDrag('to', 1)"
    ></div> -->

    <template v-if="Array.isArray(model) && Array.isArray(ranges)">
      <div
        v-for="(thumb, thumbIndex) in model"
        :key="thumbIndex"
        class="slider-thumb"
        :style="{ left: ranges[thumbIndex] + '%' }"
        @mousedown.prevent="startDrag('to', thumbIndex)"
        @touchstart.prevent="startDrag('to', thumbIndex)"
      ></div>
    </template>

    <div
      v-else
      class="slider-thumb"
      :style="{ left: ranges + '%' }"
      @mousedown.prevent="startDrag('from', 0)"
      @touchstart.prevent="startDrag('from', 0)"
    ></div>

    <!-- Display Values -->
    <div class="slider-values">
      <span>From: {{ fromValue }}</span>
      <span>To: {{ toValue }}</span>
      <span>To: {{ model }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue';
interface Props {
  min: number;
  max: number;
}

const props = withDefaults(defineProps<Props>(), {
  min: 0,
  max: 100,
});

const model = defineModel<number | Array<number>>({
  default: 0,
});

const sliderRef = ref<HTMLDivElement>();

const fromValue = ref(props.min);
const toValue = ref(props.max);

const ranges = computed(() => {
  return Array.isArray(model.value)
    ? model.value.map(val => {
        return ((val - props.min) / (props.max - props.min)) * 100;
      })
    : ((model.value - props.min) / (props.max - props.min)) * 100;
});

const rangeWidth = computed(() =>
  Array.isArray(ranges.value)
    ? Math.max(...ranges.value) - Math.min(...ranges.value)
    : ranges.value - 0,
);

let activeHandleIndex: number | null = null;
let activeHandle: 'from' | 'to' | null = null;

const calculateValueFromPosition = (
  clientX: number,
  container: HTMLElement,
) => {
  const rect = container.getBoundingClientRect();
  const position = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)); // Clamp between 0 and 1
  return Math.round(props.min + position * (props.max - props.min));
};

// Event handlers
const startDrag = (handle: 'from' | 'to', handleIndex: number) => {
  activeHandle = handle;
  activeHandleIndex = handleIndex;

  window.addEventListener('mousemove', onDrag);
  window.addEventListener('mouseup', endDrag);
  window.addEventListener('touchmove', onDrag);
  window.addEventListener('touchend', endDrag);
};

const onDrag = (event: MouseEvent | TouchEvent) => {
  if (activeHandleIndex === null) return;
  if (!activeHandle) return;

  const clientX =
    event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;

  const slider = sliderRef.value;
  if (!slider) return;

  const newValue = calculateValueFromPosition(clientX, slider);

  if (Array.isArray(model.value) && activeHandleIndex in model.value) {
    const currentValue = model.value[activeHandleIndex];
    const sortedArray = [...model.value].sort((a, b) => a - b);

    // Find the index of the current value in the sorted array
    const index = sortedArray.indexOf(currentValue);

    let nextClosest = props.max;
    let prevClosest = props.min;

    // Determine the next closest and previous closest values
    if (index > 0) {
      prevClosest = sortedArray[index - 1];
    }
    if (index < sortedArray.length - 1) {
      nextClosest = sortedArray[index + 1];
    }

    console.log(
      'prevClosest:',
      prevClosest,
      'nextClosest:',
      nextClosest,
      'currentValue:',
      currentValue,
    );

    model.value[activeHandleIndex] = Math.max(
      prevClosest + 1,
      Math.min(newValue, nextClosest - 1),
    );
  } else {
    model.value = Math.min(Math.max(newValue, props.min), props.max);
  }

  // if (activeHandle === 'from') {
  //   fromValue.value = Math.min(newValue, toValue.value - 1);
  // } else if (activeHandle === 'to') {
  //   toValue.value = Math.max(newValue, fromValue.value + 1);
  // }
};

const endDrag = () => {
  activeHandle = null;
  activeHandleIndex = null;

  window.removeEventListener('mousemove', onDrag);
  window.removeEventListener('mouseup', endDrag);
  window.removeEventListener('touchmove', onDrag);
  window.removeEventListener('touchend', endDrag);
};

const handleTrackClick = (event: MouseEvent) => {
  const slider = sliderRef.value;
  if (!slider) return;

  const clickValue = calculateValueFromPosition(event.clientX, slider);

  // Determine which handle is closer
  const distanceToFrom = Math.abs(clickValue - fromValue.value);
  const distanceToTo = Math.abs(clickValue - toValue.value);

  if (distanceToFrom < distanceToTo) {
    fromValue.value = Math.min(clickValue, toValue.value - 1); // Move "from" handle
  } else {
    toValue.value = Math.max(clickValue, fromValue.value + 1); // Move "to" handle
  }
};

// Cleanup
onUnmounted(() => {
  endDrag();
});
</script>

<style scoped>
.range-slider {
  width: 100%;
  position: relative;
  height: 1.5rem;
  border-radius: var(--rounded-box, 1rem);
  display: flex;
  align-items: center;
}

.slider-track {
  position: absolute;
  width: 100%;
  height: 0.5rem;
  background-color: var(--fallback-bc, oklch(var(--bc) / 0.1));
  border-radius: var(--rounded-box, 1rem);
}

.slider-range {
  position: absolute;
  height: 0.75rem;
  background: var(--fallback-bc, oklch(var(--bc) / 1));
  border-radius: var(--rounded-box, 1rem);
}

.slider-thumb {
  position: absolute;
  height: 1.5rem;
  width: 1.5rem;
  border-radius: var(--rounded-box, 1rem);
  border-style: none;
  --tw-bg-opacity: 1;
  background-color: var(--fallback-b1, oklch(var(--b1) / var(--tw-bg-opacity)));
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--fallback-bc, oklch(var(--bc) / 1));
  box-shadow: 0 0 0 3px var(--fallback-bc, oklch(var(--bc) / 1)) inset;
  z-index: 2;
  cursor: pointer;
}

.slider-values {
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
  width: 100%;
}
</style>
