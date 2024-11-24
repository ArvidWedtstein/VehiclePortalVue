<script setup lang="ts" generic="Dataset extends Record<string, unknown>">
import { generateDistinctColors, getNestedProperty } from '@/utils/utils';
import { computed, ref, onMounted } from 'vue';

type Serie<T> = {
  data?: number[];
  /** Gets value from dataset */
  dataKey?: keyof T;

  label?: string;
  /** Color of serie line */
  color?: string;
  /** TODO: implement */
  area?: boolean;
};

type Props<T> = {
  dataset?: T[];
  series: Serie<T>[];
  width?: number;
  height?: number;
  /** xAxis must be equal length to data */
  xAxis?: { data: string[] | number[]; dataKey?: keyof T }[];
  yTicks?: number[];
  smooth?: boolean;
  animate?: boolean;
  grid?: {
    vertical?: boolean;
    horizontal?: boolean;
  };
  hidePoints?: boolean;
};

const props = withDefaults(defineProps<Props<Dataset>>(), {
  xAxis: () => [],
  yTicks: () => [],
  grid: () => ({
    vertical: false,
    horizontal: false,
  }),
  hidePoints: false,
  width: 500,
  height: 300,
});

const padding = 50;

const chartBounds = computed(() => {
  return {
    top: padding,
    bottom: props.height - padding,
    left: padding,
    right: props.width - padding,
    width: props.width - padding * 2,
    height: props.height - padding * 2,
  };
});

const seriesData = computed(() => {
  const colors = generateDistinctColors(props.series.length);
  return props.series.map((serie, index) => {
    let data: number[] = serie.data || [];

    if (serie.dataKey && props.dataset && props.dataset?.length) {
      data = props.dataset.map(
        p => getNestedProperty(p, [serie.dataKey?.toString() || '']) as number,
      );
    }

    return {
      ...serie,
      data,
      color: serie.color || colors[index],
    };
  });
});

const xAxisLabels = computed(() => {
  // TODO: fix
  // do not use data directly. data should only indicate x points
  const labels = [
    ...(props.xAxis.length
      ? props.xAxis[0].data
      : seriesData.value
          .flatMap(({ data }) => data)
          .map((_, index) => (index + 1).toString())),
  ];

  const stepWidth = chartBounds.value.width / (labels.length - 1);

  const labelPoints = labels.map((label, index) => {
    return {
      label,
      x: chartBounds.value.left + index * stepWidth,
      y: 0,
    };
  });

  return labelPoints;
});

// Default y-axis ticks based on data range if none provided
const yAxisLabels = computed(() => {
  const steps = 5;
  const stepHeight = chartBounds.value.height / steps;

  const maxYValue = Math.max(...seriesData.value.flatMap(({ data }) => data));

  const labels = [
    ...(props.yTicks.length
      ? props.yTicks
      : Array.from({ length: steps + 1 }, (_, i) => (maxYValue / steps) * i)),
  ].sort((a, b) => b - a);

  const labelPoints = labels.map((label, index) => {
    return {
      label,
      x: 0,
      y: chartBounds.value.top + index * stepHeight,
    };
  });

  return labelPoints;
});

const seriesDataPoints = computed(() => {
  const { bottom, width, height } = chartBounds.value;
  const minVal = Math.min(...seriesData.value.flatMap(({ data }) => data));
  const maxVal = Math.max(...seriesData.value.flatMap(({ data }) => data));

  return seriesData.value.map(serie => {
    const points = serie.data
      .slice(0, xAxisLabels.value.length)
      .map((value, index, data) => {
        const x = width * (index / (data.length - 1)) + padding;
        const y = bottom - ((value - minVal) / (maxVal - minVal)) * height;

        return {
          x,
          y,
        };
      });

    return {
      ...serie,
      points,
    };
  });
});

const paths = computed(() => {
  const seriesPaths = seriesDataPoints.value.map(({ points }) => {
    let path = `M ${points[0].x},${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cp1X = p0.x + (p1.x - p0.x) / 2;
      const cp1Y = p0.y;
      const cp2X = p1.x - (p1.x - p0.x) / 2;
      const cp2Y = p1.y;

      path += ` C ${cp1X},${cp1Y} ${cp2X},${cp2Y} ${p1.x},${p1.y}`;
    }

    return path;
  });

  return seriesPaths;
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
</script>

<template>
  <svg
    :width="width"
    :height="height"
    :viewBox="`0 0 ${width} ${height}`"
    class="w-full h-full"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title></title>
    <desc></desc>
    <defs></defs>
    <g>
      <template v-if="grid?.vertical">
        <line
          v-for="({ x }, index) in xAxisLabels"
          :key="`grid-vertical-line-${index}`"
          :y1="chartBounds.top"
          :y2="chartBounds.bottom"
          :x1="x"
          :x2="x"
          class="stroke-white/10 stroke-1"
          shape-rendering="crispEdges"
        />
      </template>
      <template v-if="grid?.horizontal">
        <line
          v-for="({ y }, index) in yAxisLabels"
          :key="`grid-horizontal-line-${index}`"
          :y1="y"
          :y2="y"
          :x1="chartBounds.left"
          :x2="chartBounds.right"
          class="stroke-white/10 stroke-1"
          shape-rendering="crispEdges"
        />
      </template>
    </g>
    <g clip-path="url(#:reb:-clip-path)">
      <!-- For area -->
      <g></g>
      <g>
        <template
          v-for="({ color }, index) in seriesDataPoints"
          :key="`serie-${index}`"
        >
          <clipPath :id="`:auto-gen-id-${index}-line-clip`">
            <rect x="0" y="0" :width="width" :height="height" />
          </clipPath>
          <g :clip-path="`url(#auto-gen-id-${index}-line-clip)`">
            <path
              cursor="unset"
              stroke-linejoin="round"
              :style="{ stroke: color }"
              class="fill-transparent stroke-2"
              :d="paths[index]"
            />
          </g>
        </template>
        <!-- <clipPath id=":rec:-auto-generated-id-0-line-clip">
          <rect x="0" y="0" width="500" height="300"></rect>
        </clipPath>
        <g clip-path="url(#:rec:-auto-generated-id-0-line-clip)">
          <path
            cursor="unset"
            stroke-linejoin="round"
            class="stroke-white fill-transparent stroke-2"
            d="M50,210C64.815,175,79.63,140,94.444,140C109.259,140,124.074,210,138.889,210C168.519,210,198.148,80,227.778,80C272.222,80,316.667,220,361.111,220C390.741,220,420.37,185,450,150"
          ></path>
        </g> -->
      </g>
    </g>

    <g :transform="`translate(0, ${chartBounds.bottom})`">
      <line
        :x1="chartBounds.left"
        :x2="chartBounds.right"
        shape-rendering="crispEdges"
        class="stroke-white"
      ></line>
      <g
        v-for="({ label, x, y }, index) in xAxisLabels"
        :key="'x-tick-' + index"
        :transform="`translate(${x}, ${y})`"
      >
        <line y2="6" shape-rendering="crispEdges" class="stroke-white" />
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
    <g :transform="`translate(${chartBounds.left}, 0)`">
      <line
        :y1="chartBounds.top"
        :y2="chartBounds.bottom"
        shape-rendering="crispEdges"
        class="stroke-white"
        stroke-linecap="square"
      ></line>
      <g
        v-for="({ label, x, y }, index) in yAxisLabels"
        :key="'y-tick-' + index"
        :transform="`translate(${x}, ${y})`"
      >
        <line x2="-6" shape-rendering="crispEdges" class="stroke-white"></line>
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
      <g v-if="!hidePoints">
        <g
          v-for="({ color, points }, serieIndex) in seriesDataPoints"
          :key="`serie-${serieIndex}-points`"
          :clip-path="`url(#auto-generated-id-${serieIndex}-line-clip)`"
        >
          <path
            v-for="({ x, y }, index) in points"
            :key="`serie-${serieIndex}-point-${index}`"
            :style="{
              transform: `translate(${x}px, ${y}px)`,
              'transform-origin': `${x}px ${y}px 0px`,
              stroke: color,
            }"
            class="stroke-2 fill-base-100"
            d="M4.514,0A4.514,4.514,0,1,1,-4.514,0A4.514,4.514,0,1,1,4.514,0"
            cursor="unset"
          />
        </g>
      </g>
    </g>
    <clipPath id="some-clip-path">
      <rect
        :x="chartBounds.left"
        :y="chartBounds.top"
        :width="chartBounds.width"
        :height="chartBounds.height"
      />
    </clipPath>
  </svg>
</template>
