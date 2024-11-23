<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';

interface Props {
  data: number[];
  width?: number;
  height?: number;
  xTicks?: string[];
  yTicks?: number[];
  smooth?: boolean;
  animate?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  yTicks: () => [],
});

// Set default width, height, and padding
const width = props.width ?? 400;
const height = props.height ?? 200;
const padding = 12; // Increased padding for better centering

// Default x-axis labels (e.g., based on data indices) if none provided
const xLabels = computed(
  () => props.xTicks ?? props.data.map((_, index) => (index + 1).toString()),
);

// Default y-axis ticks based on data range if none provided
const yLabels = computed(() => {
  if (props.yTicks.length) return [...props.yTicks].sort((a, b) => b - a);

  const maxY = Math.max(...props.data);
  const interval = maxY / 5;

  // TODO: fix
  const labels = Array.from({ length: 6 }, (_, i) =>
    Math.round(i * interval),
  ).reverse();

  return labels;
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

<template>
  <svg width="500" height="300" viewBox="0 0 500 300" class="w-full h-full">
    <title></title>
    <desc></desc>
    <defs></defs>
    <g class="MuiChartsGrid-root css-0"></g>
    <g clip-path="url(#:reb:-clip-path)">
      <g>
        <clipPath id=":rec:-auto-generated-id-0-line-clip">
          <rect x="0" y="0" width="500" height="300"></rect>
        </clipPath>
        <g clip-path="url(#:rec:-auto-generated-id-0-line-clip)">
          <path
            cursor="unset"
            stroke-linejoin="round"
            class="stroke-white fill-transparent stroke-2"
            d="M50,210C64.815,175,79.63,140,94.444,140C109.259,140,124.074,210,138.889,210C168.519,210,198.148,80,227.778,80C272.222,80,316.667,220,361.111,220C390.741,220,420.37,185,450,150"
          ></path>
        </g>
      </g>
    </g>
    <g transform="translate(0, 250)">
      <line
        x1="50"
        x2="450"
        shape-rendering="crispedges"
        class="stroke-white"
      ></line>
      <g
        v-for="(label, index) in xLabels"
        :key="'x-tick-' + index"
        :transform="`translate(${50 + index * (400 / (xLabels.length - 1))}, 0)`"
      >
        <line y2="6" shape-rendering="crispedges" class="stroke-white"></line>
        <text
          class="fill-white"
          x="0"
          y="9"
          text-anchor="middle"
          dominant-baseline="hanging"
          style="font-size: 12px"
        >
          <tspan x="0" dy="0px" dominant-baseline="hanging">{{ label }}</tspan>
        </text>
      </g>
    </g>
    <g transform="translate(50, 0)">
      <line
        y1="50"
        y2="250"
        shape-rendering="crispedges"
        class="stroke-white"
        stroke-linecap="square"
      ></line>
      <g
        v-for="(label, index) in yLabels"
        :key="'y-tick-' + index"
        :transform="`translate(0, ${50 + index * (200 / (yLabels.length - 1))})`"
      >
        <line x2="-6" shape-rendering="crispedges" class="stroke-white"></line>
        <text
          class="fill-white"
          x="-8"
          y="0"
          text-anchor="end"
          dominant-baseline="central"
          style="font-size: 12px"
        >
          <tspan x="-8" dy="0px" dominant-baseline="central">{{ label }}</tspan>
        </text>
      </g>
    </g>
    <g data-drawing-container="true">
      <g>
        <g clip-path="url(#:rec:-auto-generated-id-0-line-clip)">
          <path
            style="
              transform: translate(50px, 210px);
              transform-origin: 50px 210px 0px;
            "
            class="stroke-2 stroke-white fill-base-100"
            d="M4.514,0A4.514,4.514,0,1,1,-4.514,0A4.514,4.514,0,1,1,4.514,0"
            cursor="unset"
          ></path>
          <path
            style="
              transform: translate(94.4444px, 140px);
              transform-origin: 94.4444px 140px 0px;
            "
            class="stroke-2 stroke-white fill-base-100"
            d="M4.514,0A4.514,4.514,0,1,1,-4.514,0A4.514,4.514,0,1,1,4.514,0"
            cursor="unset"
          ></path>
          <path
            style="
              transform: translate(138.889px, 210px);
              transform-origin: 138.889px 210px 0px;
            "
            class="stroke-2 stroke-white fill-base-100"
            d="M4.514,0A4.514,4.514,0,1,1,-4.514,0A4.514,4.514,0,1,1,4.514,0"
            cursor="unset"
          ></path>
          <path
            style="
              transform: translate(227.778px, 80px);
              transform-origin: 227.778px 80px 0px;
            "
            class="stroke-2 stroke-white fill-base-100"
            d="M4.514,0A4.514,4.514,0,1,1,-4.514,0A4.514,4.514,0,1,1,4.514,0"
            cursor="unset"
          ></path>
          <path
            style="
              transform: translate(361.111px, 220px);
              transform-origin: 361.111px 220px 0px;
            "
            class="stroke-2 stroke-white fill-base-100"
            d="M4.514,0A4.514,4.514,0,1,1,-4.514,0A4.514,4.514,0,1,1,4.514,0"
            cursor="unset"
          ></path>
          <path
            style="
              transform: translate(450px, 150px);
              transform-origin: 450px 150px 0px;
            "
            class="stroke-2 stroke-white fill-base-100"
            d="M4.514,0A4.514,4.514,0,1,1,-4.514,0A4.514,4.514,0,1,1,4.514,0"
            cursor="unset"
          ></path>
        </g>
      </g>
    </g>
    <clipPath id=":reb:-clip-path">
      <rect x="50" y="50" width="400" height="200"></rect>
    </clipPath>
  </svg>
</template>
