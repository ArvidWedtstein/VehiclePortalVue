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
  /** TODO: implement */
  area?: boolean;

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
      curve: serie.curve || 'natural',
    };
  });
});

const offsetRatio = {
  start: 0,
  extremities: 0,
  end: 1,
  middle: 0.5,
} as const;

const scale = <S extends ScaleTypes>(
  value: number,
  axis: 'x' | 'y' = 'x',
  scaleType: S,
  ticks: {
    value: number | Date;
    index: number;
  }[],
  tickPlacement: 'start' | 'end' | 'middle' | 'extremities' = 'extremities',
  tickLabelPlacement: 'middle' | 'tick' = 'tick',
) => {
  const { left, right, top, bottom, width, height } = chartBounds.value;

  const scaleSize = axis === 'x' ? width : height;
  const rangeMin = axis === 'x' ? left : top;

  const rangeMax = axis === 'x' ? right : bottom;

  if (ticks.length === 0) {
    return {
      coord: rangeMin,
      labelOffset: 0,
    };
  }

  if (
    scaleType === 'linear' ||
    scaleType === 'log' ||
    scaleType === 'sqrt' ||
    scaleType === 'pow'
  ) {
    const domainMin = Math.min(
      ...(ticks.map(({ value }) => value) as number[]),
    );
    const domainMax = Math.max(
      ...(ticks.map(({ value }) => value) as number[]),
    );

    if (scaleType === 'linear') {
      if (typeof value !== 'number') return { coord: rangeMin, labelOffset: 0 };

      const normalized = (value - domainMin) / (domainMax - domainMin);
      const scaledValue = rangeMin + normalized * scaleSize;

      console.log(
        'axis',
        axis,
        value,
        scaledValue,
        normalized,
        domainMin,
        domainMax,
        scaleSize,
      );
      return {
        coord: axis === 'x' ? scaledValue : rangeMax - (scaledValue - rangeMin),
        labelOffset: 0,
      };
    }

    if (scaleType === 'log' && typeof value === 'number') {
      const normalized =
        (Math.log(value) - Math.log(domainMin)) /
        (Math.log(domainMax) - Math.log(domainMin));

      return { coord: rangeMin + normalized * scaleSize, labelOffset: 0 };
    }

    if (scaleType === 'sqrt' && typeof value === 'number') {
      const normalized =
        (Math.sqrt(value) - Math.sqrt(domainMin)) /
        (Math.sqrt(domainMax) - Math.sqrt(domainMin));

      return { coord: rangeMin + normalized * scaleSize, labelOffset: 0 };
    }

    if (scaleType === 'pow' && typeof value === 'number') {
      const power = 2; // Adjust power as needed
      const normalized =
        (Math.pow(value, power) - Math.pow(domainMin, power)) /
        (Math.pow(domainMax, power) - Math.pow(domainMin, power));

      return { coord: rangeMin + normalized * scaleSize, labelOffset: 0 };
    }
  }

  if (scaleType === 'band' || scaleType === 'point') {
    const step = scaleSize / ticks.length;
    const tickIndex = ticks.findIndex(
      ({ value: tickValue }) => tickValue === value,
    );

    if (tickIndex === -1) {
      return { coord: rangeMin, labelOffset: 0 };
    }

    const labelOffset =
      tickLabelPlacement === 'tick'
        ? 0
        : step * (offsetRatio[tickLabelPlacement] - offsetRatio[tickPlacement]);

    const scaledValue = rangeMin + tickIndex * step;

    return {
      coord: axis === 'x' ? scaledValue : rangeMax - (scaledValue - rangeMin),
      labelOffset,
    };
  }

  if (scaleType === 'time' || scaleType === 'utc') {
    const domainMin = Math.min(
      ...(ticks.map(({ value }) => value) as Date[]).map(d =>
        new Date(d).getTime(),
      ),
    );
    const domainMax = Math.max(
      ...(ticks.map(({ value }) => value) as Date[]).map(d =>
        new Date(d).getTime(),
      ),
    );
    const normalized =
      (new Date(value).getTime() - domainMin) / (domainMax - domainMin);

    return { coord: rangeMin + normalized * scaleSize, labelOffset: 0 };
  }

  return { coord: rangeMin, labelOffset: 0 };
};

const formatTick = (value: string | number | Date, scaleType: ScaleType) => {
  if (scaleType === 'time' || scaleType === 'utc') {
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

    const steps = data.length > 0 ? data.length - 1 : 5;

    const min = Math.min(...(data as number[]));
    const max = Math.max(...(data as number[]));

    const ticks = generateTicks(min, max, steps, scaleType);

    const ticksPosition = ticks.map(({ value, index }) => {
      const { coord: scaleX, labelOffset } = scale(
        value as number & Date,
        'x',
        scaleType,
        ticks,
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
  const { height, left } = chartBounds.value;

  const yAxesWithData = props.yAxis.map(axis => {
    const { scaleType = 'linear' as ScaleType, dataKey, data: axisData } = axis;
    let data = (axisData as number[]) || [];

    if (dataKey && props.dataset) {
      data = props.dataset.map(
        p => getNestedProperty(p, [dataKey?.toString() || '']) as number,
      );
    }

    const seriesFlat = seriesData.value.flatMap(({ data }) => data);
    const steps = data.length > 0 ? data.length - 1 : 5;

    const min = Math.min(...(data.length > 0 ? data : seriesFlat));
    const max = Math.max(...(data.length > 0 ? data : seriesFlat));

    const ticks = generateTicks(min, max, steps, scaleType);
    const stepHeight = height / steps;

    const ticksPosition = ticks.map(({ value, index }) => {
      const { coord: scaleY } = scale(
        value as number & Date,
        'y',
        scaleType,
        ticks,
      );

      return {
        index,
        label: value,
        x: 0,
        y: scaleY,
        tickX: -6,
        tickY: 0,
        labelX: -8,
        labelY: scaleType === 'band' ? stepHeight / 2 : 0,
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
  const { top, bottom, left, right } = chartBounds.value;

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
        );

        return {
          x: (xPos?.x || 0) + (xPos?.labelX || 0),
          y: yScale,
        };
      });

    const path = generatePath(points, serie.curve);

    const areaPath = serie.area
      ? // ? path + `L${right},${bottom} Z`
        path +
        `C272.222,225,316.667,160.5,361.111,135 C390.741,118,420.37,104,450,90L450,250 C420.37,250,390.741,250,361.111,250 C316.667,250,272.222,250,227.778,250 C198.148,250,168.519,250,138.889,250 C124.074,250,109.259,250,94.444,250 C79.63,250,64.815,250, ${left},${bottom}Z`
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
              :style="{ stroke: color }"
              class="fill-transparent stroke-2"
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
          {{ formatTick(label as number | string | Date, axis.scaleType) }}
        </text>
      </g>
      <!-- <g
        v-for="({ label, x, y }, index) in xAxisLabels"
        :key="'x-tick-' + index"
        :transform="`translate(${x}, ${y})`"
      >
        <line y2="6" shape-rendering="crispEdges" class="stroke-white" />
        <text
          class="fill-white text-xs"
          x="0"
          y="9"
          text-anchor="middle"
          dominant-baseline="hanging"
        >
          <tspan x="0" dy="0px" dominant-baseline="hanging">{{ label }}</tspan>
        </text>
      </g> -->
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
          <!-- todo: make fill transparent-->
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
