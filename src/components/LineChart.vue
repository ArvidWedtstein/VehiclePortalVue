<template>
  <svg :width="width" :height="height" viewBox="0 0 100 100">
    <!-- Y Axis Ticks and Labels -->
    <g v-for="(tick, index) in yTicks" :key="'y-tick-' + index">
      <line
        :x1="padding"
        :x2="100 - padding"
        :y1="scaleY(tick)"
        :y2="scaleY(tick)"
        stroke="#dddddd33"
        stroke-width="0.5"
      />
      <text
        :x="padding - 2"
        :y="scaleY(tick) + 2"
        text-anchor="end"
        font-size="2"
        class="fill-current"
      >
        {{ tick }}
      </text>
    </g>

    <!-- X Axis Ticks and Labels -->
    <g v-for="(label, index) in xLabels" :key="'x-tick-' + index">
      <line
        :x1="scaleX(index)"
        :x2="scaleX(index)"
        :y1="100 - padding"
        :y2="100 - padding + 2"
        class="stroke-current"
        stroke-linecap="round"
        stroke-width="0.5"
      />
      <text
        :x="scaleX(index)"
        :y="100 - padding + 5"
        text-anchor="middle"
        font-size="2"
        class="fill-current"
      >
        {{ label }}
      </text>
    </g>

    <!-- Animated Line Chart Path -->
    <path
      ref="chartPath"
      :d="pathData"
      fill="none"
      stroke="red"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      :style="lineStyle"
    />

    <!-- X and Y Axis Lines -->
    <line
      :x1="padding"
      :x2="padding"
      :y1="padding"
      :y2="100 - padding"
      class="stroke-current"
      stroke-linecap="round"
      stroke-width="0.5"
    />
    <line
      :x1="padding"
      :x2="100 - padding"
      :y1="100 - padding"
      :y2="100 - padding"
      class="stroke-current"
      stroke-linecap="round"
      stroke-width="0.5"
    />
  </svg>
</template>

<script setup lang="ts">
import { computed, defineProps, ref, onMounted } from 'vue';

interface Props {
  data: number[];
  width?: number;
  height?: number;
  xLabels?: string[];
  yTicks?: number[];
  smooth?: boolean;
  animate?: boolean;
}

const props = defineProps<Props>();

// Set default width, height, and padding
const width = props.width ?? 400;
const height = props.height ?? 200;
const padding = 12; // Increased padding for better centering

// Default x-axis labels (e.g., based on data indices) if none provided
const xLabels = computed(
  () => props.xLabels ?? props.data.map((_, index) => (index + 1).toString()),
);

// Default y-axis ticks based on data range if none provided
const yTicks = computed(() => {
  if (props.yTicks) return props.yTicks;
  const maxY = Math.max(...props.data);
  const interval = maxY / 5;
  return Array.from({ length: 6 }, (_, i) => Math.round(i * interval));
});

// Scale functions for x and y axes (accounting for padding)
const scaleX = (index: number) =>
  padding + (index / (props.data.length - 1)) * (100 - 2 * padding);
const scaleY = (value: number) =>
  100 - padding - (value / Math.max(...props.data)) * (100 - 2 * padding);

// Generate path data for the line chart
const pathData = computed(() => {
  if (props.data.length === 0) return '';

  const points = props.data.map(
    (value, index) => `${scaleX(index)},${scaleY(value)}`,
  );

  if (props.smooth) {
    const path = [`M ${points[0]}`];

    for (let i = 0; i < points.length - 1; i++) {
      const [x1, y1] = points[i].split(',').map(Number);
      const [x2, y2] = points[i + 1].split(',').map(Number);

      // Calculate the previous and next points
      const prevPoint = i > 0 ? points[i - 1].split(',').map(Number) : [x1, y1];
      const nextPoint =
        i < points.length - 2 ? points[i + 2].split(',').map(Number) : [x2, y2];

      // Calculate control points to smooth the curve
      const controlPoint1 = [(x1 + prevPoint[0]) / 2, (y1 + prevPoint[1]) / 2];
      const controlPoint2 = [(x2 + nextPoint[0]) / 2, (y2 + nextPoint[1]) / 2];

      path.push(
        `C ${controlPoint1[0]},${controlPoint1[1]} ${controlPoint2[0]},${controlPoint2[1]} ${x2},${y2}`,
      );
    }

    return path.join(' ');
  }

  // Straight line path
  return (
    `M ${points[0]} ` +
    points
      .slice(1)
      .map(point => `L ${point}`)
      .join(' ')
  );
});

// Refs for animation setup
const chartPath = ref<SVGPathElement | null>(null);
const dashArray = ref('0');
const dashOffset = ref('0');

// Animation handler
onMounted(() => {
  if (props.animate && chartPath.value) {
    const length = chartPath.value.getTotalLength();
    dashArray.value = length.toString();
    dashOffset.value = length.toString();

    // Trigger the animation
    requestAnimationFrame(() => {
      dashOffset.value = '0';
    });
  }
});

// Line style with animation if enabled
const lineStyle = computed(() => ({
  strokeDasharray: props.animate ? dashArray.value : undefined,
  strokeDashoffset: props.animate ? dashOffset.value : undefined,
  transition: props.animate ? 'stroke-dashoffset 2s ease' : undefined,
}));
</script>
