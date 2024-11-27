<script
  setup
  lang="ts"
  generic="
    Dataset extends Record<string, unknown>,
    ScaleType extends ScaleTypes
  "
>
import {
  generatePath,
  generateTicks,
  scale,
  type ScaleTypes,
} from '@/utils/lineChart';
import { generateDistinctColors, getNestedProperty } from '@/utils/utils';
import { computed } from 'vue';

type Serie<T> = {
  data?: number[];
  /** Gets value from dataset */
  dataKey?: keyof T;

  label?: string;
  /** Color of serie line */
  color?: string;
  /** Displays area of line */
  area?: boolean;
  /** Baseline for area. Default is min */
  baseline?: 'min' | 'max';

  /** Curve Style */
  curve?:
    | 'catmullRom'
    | 'linear'
    | 'monotoneX'
    | 'monotoneY'
    | 'natural'
    | 'step'
    | 'stepBefore'
    | 'stepAfter';

  showMark?: (index: number) => boolean;
};

type AxisDataType<S extends ScaleTypes> = S extends 'linear' | 'log' | 'sqrt'
  ? number[]
  : S extends 'time' | 'utc'
    ? Date[]
    : S extends 'band' | 'point'
      ? (string | number)[]
      : unknown[];

type Axis<T, S extends ScaleTypes> = {
  data?: AxisDataType<S>;
  dataKey?: keyof T;
  scaleType?: S;

  position?: 'top' | 'bottom' | 'left' | 'right';

  valueFormatter?: (value: AxisDataType<S>[number]) => string;
};

type Props<T> = {
  dataset?: T[];
  series: Serie<T>[];
  width?: number;
  height?: number;
  xAxis?: Axis<T, ScaleType>[];
  yAxis?: Axis<T, ScaleType>[];
  yTicks?: number[];
  smooth?: boolean;
  animate?: boolean;
  grid?: {
    vertical?: boolean;
    horizontal?: boolean;
  };
  margin?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
  hidePoints?: boolean;
};

const props = withDefaults(defineProps<Props<Dataset>>(), {
  xAxis: () => [],
  yAxis: () => [
    {
      position: 'left',
      scaleType: 'linear' as ScaleType,
    },
  ],
  grid: () => ({
    vertical: false,
    horizontal: false,
  }),
  margin: () => ({
    top: 50,
    bottom: 50,
    left: 50,
    right: 50,
  }),
  hidePoints: false,
  width: 500,
  height: 300,
});

const chartBounds = computed(() => {
  const defaultMargins = {
    top: 50,
    bottom: 50,
    left: 50,
    right: 50,
  };

  const { top, bottom, left, right } = Object.assign(
    defaultMargins,
    props.margin,
  );

  return {
    top: top,
    bottom: props.height - bottom,
    left: left,
    right: props.width - right,
    width: props.width - left - right,
    height: props.height - left - right,
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
      baseline: serie.baseline ?? 'min',
      color: serie.color || colors[index],
      curve: serie.curve || 'natural',
    };
  });
});

const formatTick = (
  value: string | number | Date,
  axis: Axis<Dataset, ScaleType>,
) => {
  if (axis.valueFormatter) {
    return axis.valueFormatter(value);
  }

  if (axis.scaleType === 'time' || axis.scaleType === 'utc') {
    return new Date(value).toISOString().split('T')[0];
  }
  return parseInt(value.toString());
};

const xAxes = computed(() => {
  const { bottom } = chartBounds.value;

  const xAxesWithData = props.xAxis.map(axis => {
    const { scaleType = 'linear' as ScaleType, dataKey, data: axisData } = axis;
    let data = (axisData || []) as AxisDataType<ScaleType>;

    if (dataKey && props.dataset) {
      data = props.dataset.map(
        p => getNestedProperty(p, [dataKey?.toString() || '']) as number,
      ) as AxisDataType<ScaleType>;
    }

    const steps = data.length > 0 ? data.length : 5;

    const min = Math.min(...((data || [0]) as number[]));
    const max = Math.max(...((data || [10]) as number[]));

    const ticks = generateTicks(min, max, steps, scaleType);

    const ticksPosition = ticks.map(({ value, index }) => {
      const { coord: scaleX, labelOffset } = scale(
        value as number & Date,
        'x',
        scaleType,
        ticks,
        chartBounds.value,
        'extremities',
        scaleType === 'band' ? 'middle' : 'tick',
      );

      return {
        index,
        label: value,
        x: scaleX,
        y: 0,
        tickX: 0,
        tickY: 6,
        labelX: labelOffset,
        labelY: 9,
      };
    });

    // TODO: fix position
    const position = {
      x: 0,
      y: bottom,
    };

    return {
      ...axis,
      scaleType,
      data,
      ...position,
      ticks: ticksPosition,
    };
  });

  return xAxesWithData;
});

const yAxes = computed(() => {
  const { left } = chartBounds.value;

  const yAxesWithData = props.yAxis.map(axis => {
    const { scaleType = 'linear' as ScaleType, dataKey, data: axisData } = axis;
    let data = (axisData as number[]) || [];

    if (dataKey && props.dataset) {
      data = props.dataset.map(
        p => getNestedProperty(p, [dataKey?.toString() || '']) as number,
      );
    }

    const seriesFlat = seriesData.value.flatMap(({ data }) => data);
    const steps = data.length > 0 ? data.length : 5;

    const min = Math.min(...(data.length > 0 ? data : seriesFlat));
    const max = Math.max(...(data.length > 0 ? data : seriesFlat));

    const ticks = generateTicks(min, max, steps, scaleType);

    const ticksPosition = ticks.map(({ value, index }) => {
      const { coord: scaleY, labelOffset } = scale(
        value as number & Date,
        'y',
        scaleType,
        ticks,
        chartBounds.value,
        'extremities',
        scaleType === 'band' ? 'middle' : 'tick',
      );

      return {
        index,
        label: value,
        x: 0,
        y: scaleY,
        tickX: -6,
        tickY: 0,
        labelX: -8,
        labelY: labelOffset,
      };
    });

    // TODO: fix position
    const position = {
      x: left,
      y: 0,
    };

    return {
      ...axis,
      scaleType,
      data,
      ...position,
      ticks: ticksPosition,
    };
  });

  return yAxesWithData;
});

const seriesDataPoints = computed(() => {
  const { top, bottom } = chartBounds.value;

  const xAxis = xAxes.value[0];
  const yAxis = yAxes.value[0];

  const series = seriesData.value.map(serie => {
    const points = serie.data
      .slice(0, xAxes.value[0].data.length)
      .map((value, index) => {
        const xPos = xAxis.ticks.find((_, i) => i === index);

        const { coord: yScale } = scale(
          value,
          'y',
          yAxis.scaleType,
          yAxis.ticks.map(({ label, index }) => ({ value: label, index })),
          chartBounds.value,
        );

        return {
          x: (xPos?.x || 0) + (xPos?.labelX || 0),
          y: yScale,
        };
      });

    const path = generatePath(points, serie.curve);

    const pathRegex = /M\s*(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)/;

    const firstX = path.match(pathRegex)?.[0].split(',')[0].replace('M', '');
    const lastX = path.substring(path.lastIndexOf(' '), path.lastIndexOf(','));

    const yPos =
      serie.baseline === 'min' ? bottom : serie.baseline === 'max' ? top : 0;

    const areaPath = serie.area
      ? path + `L${lastX},${yPos} ${firstX},${yPos}Z`
      : '';

    return {
      ...serie,
      path,
      areaPath,
      points,
    };
  });

  return series;
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
          v-for="({ x }, index) in xAxes[0].ticks"
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
          v-for="({ y }, index) in yAxes[0].ticks"
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
    <g>
      <!-- For area -->
      <g>
        <template
          v-for="({ color, areaPath }, index) in seriesDataPoints.filter(
            ({ area }) => area,
          )"
          :key="`serie-area-${index}`"
        >
          <clipPath :id="`:auto-gen-id-${index}-area-clip`">
            <rect x="0" y="0" :width="width" :height="height" />
          </clipPath>

          <g :clip-path="`url(#auto-gen-id-${index}-area-clip)`">
            <path
              cursor="unset"
              stroke-linejoin="round"
              :style="{ fill: color }"
              class="stroke-none"
              :d="areaPath"
            />
          </g>
        </template>
      </g>
      <g>
        <template
          v-for="({ color, path }, index) in seriesDataPoints"
          :key="`serie-line-${index}`"
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
              :d="path"
            />
          </g>
        </template>
      </g>
    </g>

    <g
      v-for="(axis, axisIndex) in xAxes"
      :key="`x-axis-${axisIndex}`"
      :transform="`translate(${axis.x}, ${axis.y})`"
    >
      <line
        :x1="chartBounds.left"
        :x2="chartBounds.right"
        shape-rendering="crispEdges"
        class="stroke-white"
      ></line>

      <g
        v-for="(
          { label, x, y, tickX, tickY, labelX, labelY }, index
        ) in axis.ticks"
        :key="`x-axis-${axisIndex}-ticks-${index}`"
        :transform="`translate(${x}, ${y})`"
      >
        <!-- Tick Lines -->
        <line :x1="tickX" :x2="tickX" :y2="tickY" stroke="white" />
        <!-- Labels -->
        <text
          :x="labelX"
          :y="labelY"
          class="text-xs fill-white"
          text-anchor="middle"
          dominant-baseline="hanging"
        >
          {{ formatTick(label as number | string | Date, axis) }}
        </text>
      </g>
    </g>
    <g
      v-for="(axis, axisIndex) in yAxes"
      :key="`y-axis-${axisIndex}`"
      :transform="`translate(${axis.x}, ${axis.y})`"
    >
      <line
        :y1="chartBounds.top"
        :y2="chartBounds.bottom"
        shape-rendering="crispEdges"
        class="stroke-white"
        stroke-linecap="square"
      />

      <g
        v-for="(
          { label, x, y, tickX, tickY, labelX, labelY }, index
        ) in axis.ticks"
        :key="'y-tick-' + index"
        :transform="`translate(${x}, ${y})`"
      >
        <line
          :x2="tickX"
          :y2="tickY"
          shape-rendering="crispEdges"
          class="stroke-white"
        ></line>
        <text
          class="text-xs fill-white"
          :x="labelX"
          :y="labelY"
          text-anchor="end"
          dominant-baseline="central"
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
