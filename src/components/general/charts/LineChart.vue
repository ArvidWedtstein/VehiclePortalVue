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
import {
  debounce,
  generateDistinctColors,
  getNestedProperty,
} from '@/utils/utils';
import { computed, ref } from 'vue';

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

  /** TODO: Formats value for tooltip */
  valueFormatter?: (value: T[keyof T]) => string;
};

type AxisDataType<S extends ScaleTypes> = S extends 'linear' | 'log' | 'sqrt'
  ? number[]
  : S extends 'time' | 'utc'
    ? Date[]
    : S extends 'band' | 'point'
      ? (string | number)[]
      : number[];

type Axis<T, S extends ScaleTypes> = {
  data?: AxisDataType<S>;
  dataKey?: keyof T;
  scaleType?: S;

  position?: 'top' | 'bottom' | 'left' | 'right';

  /** TODO: fix type */
  valueFormatter?: (
    value:
      | T[keyof T]
      | (AxisDataType<S>[number] extends never
          ? number
          : AxisDataType<S>[number]),
  ) => string;
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
  xAxis: () => [{ position: 'bottom', scaleType: 'linear' as ScaleType }],
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
    return axis.valueFormatter(value as Dataset[keyof Dataset]);
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
      data = props.dataset.map(p =>
        getNestedProperty(p, [dataKey?.toString() || '']),
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
    let data = (axisData || []) as AxisDataType<ScaleType>;

    if (dataKey && props.dataset) {
      data = props.dataset.map(p =>
        getNestedProperty(p, [dataKey?.toString() || '']),
      ) as AxisDataType<ScaleType>;
    }

    const seriesFlat = seriesData.value.flatMap(({ data }) => data);
    const steps = data.length > 0 ? data.length : 5;

    const min = Math.min(
      ...(data.length > 0 ? (data as number[]) : seriesFlat),
    );
    const max = Math.max(
      ...(data.length > 0 ? (data as number[]) : seriesFlat),
    );

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

  const series = seriesData.value.map((serie, serieIndex) => {
    const xAxis =
      xAxes.value[serieIndex > xAxes.value.length - 1 ? 0 : serieIndex];
    const yAxis =
      yAxes.value[serieIndex > yAxes.value.length - 1 ? 0 : serieIndex];

    const points = serie.data
      .slice(0, xAxis.data.length)
      .map((value, index) => {
        // TODO: replace this with gap between lines instead
        if (value === null || value === undefined) return undefined;

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
      })
      .filter(p => p !== undefined);

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

type Tooltip = {
  nearestX?: number;
  visible: boolean;
  x: number;
  y: number;
  content: string;
};

const tooltip = ref<Tooltip>({
  visible: false,
  x: 0,
  y: 0,
  content: '',
});

const handlePointerMove = (event: PointerEvent) => {
  // TODO: fix
  // const target = event.currentTarget as SVGElement;
  // const isValid = target && target.hasPointerCapture(event.pointerId);

  // if (!isValid) return;

  // console.log(
  //   'pointer',
  //   event,
  //   isValid,
  //   target.hasPointerCapture(event.pointerId),
  //   target.releasePointerCapture(event.pointerId),
  // );

  const bounds = chartBounds.value; // Use chart bounds for accurate positioning
  const mouseX = event.offsetX - bounds.left;
  const mouseY = event.offsetY - bounds.top;

  const nearestX = getNearestX(mouseX);
  if (!nearestX) return;

  const data = seriesData.value[0].data[nearestX.index]; // Find data for the nearest x point

  const content = `
    ${xAxes.value[0].dataKey?.toString() || 'X'}: ${data}
    `;

  tooltip.value = {
    nearestX: nearestX.x,
    // nearestX: mouseX,
    visible: false,
    x: mouseX,
    y: mouseY,
    content,
  };
};

const handlePointerHide = () => {
  // tooltip.value.visible = false;
};

const getNearestX = (mouseX: number) => {
  const xAxis = xAxes.value[0];

  const { ticks } = xAxis;

  // Find the nearest x-axis tick to the mouse position
  const nearest = ticks.reduce((prev, curr) =>
    Math.abs(curr.x - mouseX) < Math.abs(prev.x - mouseX) ? curr : prev,
  );

  return nearest;
};
</script>

<template>
  <svg
    :width="width"
    :height="height"
    :viewBox="`0 0 ${width} ${height}`"
    class="relative w-full h-full"
    xmlns="http://www.w3.org/2000/svg"
    @pointermove="$event => debounce(() => handlePointerMove($event), 100)()"
    @pointerout="$event => debounce(() => handlePointerHide(), 50)()"
    @pointerleave="$event => debounce(() => handlePointerHide(), 50)()"
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

      <!-- Tooltip element -->
      <path
        v-if="tooltip.visible"
        :d="`M${tooltip.nearestX},${chartBounds.bottom} L${tooltip.nearestX},${chartBounds.top}`"
        class="stroke-1 stroke-white"
        stroke-dasharray="5 2"
      />
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
      />

      <g
        v-for="(
          { label, x, y, tickX, tickY, labelX, labelY }, index
        ) in axis.ticks"
        :key="`x-axis-${axisIndex}-ticks-${index}`"
        :transform="`translate(${x}, ${y})`"
      >
        <line :x1="tickX" :x2="tickX" :y2="tickY" class="stroke-white" />

        <text
          :x="labelX"
          :y="labelY"
          class="text-xs fill-white"
          text-anchor="middle"
          dominant-baseline="hanging"
        >
          <tspan :x="labelX" dy="0px" dominant-baseline="central">
            {{ formatTick(label as number | string | Date, axis) }}
          </tspan>
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
        />
        <text
          class="text-xs fill-white"
          :x="labelX"
          :y="labelY"
          text-anchor="end"
          dominant-baseline="central"
        >
          <tspan :x="labelX" dy="0px" dominant-baseline="central">
            {{ formatTick(label as number | string | Date, axis) }}
          </tspan>
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
    <g v-if="tooltip.visible">
      <rect
        class="fill-red-500"
        width="100"
        height="50"
        rx="7"
        :x="tooltip.x"
        :y="tooltip.y"
      />
      <text
        :x="tooltip.x"
        :y="tooltip.y"
        class="text-xs fill-white"
        dominant-baseline="hanging"
      >
        <tspan
          dy="0px"
          dominant-baseline="hanging"
          v-html="tooltip.content"
        ></tspan>
      </text>
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
