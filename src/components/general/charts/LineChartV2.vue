<script
  setup
  lang="ts"
  generic="
    Dataset extends Record<string, unknown>,
    ScaleType extends ScaleTypes
  "
>
import { generateTicks, type ScaleTypes } from '@/utils/lineChart';
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

  curve?: 'linear' | 'catmullRom';

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

const scale = <S extends ScaleTypes>(
  value: number,
  axis: 'x' | 'y' = 'x',
  scaleType: S,
  domain: Axis<Dataset, S>['data'] | undefined,
) => {
  const { left, bottom, width } = chartBounds.value;

  const domainData = (domain || []) as AxisDataType<S>;

  const domainMin =
    scaleType === 'time' || scaleType === 'utc'
      ? Math.min(...(domainData as Date[]).map(d => d.getTime()))
      : Math.min(...(domainData as number[]));
  const domainMax =
    scaleType === 'time' || scaleType === 'utc'
      ? Math.max(...(domainData as Date[]).map(d => d.getTime()))
      : Math.max(...(domainData as number[]));

  const rangeMin = axis === 'x' ? left : bottom;

  if (scaleType === 'linear' && !!value) {
    const step = width / (domainData.length - 1);
    const index = domainData.indexOf(value as number & Date);
    return rangeMin + index * step;
  }

  if (scaleType === 'log' && typeof value === 'number') {
    const normalized =
      (Math.log(value) - Math.log(domainMin)) /
      (Math.log(domainMax) - Math.log(domainMin));
    return rangeMin + normalized * width;
  }

  if (scaleType === 'sqrt' && typeof value === 'number') {
    const normalized =
      (Math.sqrt(value) - Math.sqrt(domainMin)) /
      (Math.sqrt(domainMax) - Math.sqrt(domainMin));
    return rangeMin + normalized * width;
  }

  if (scaleType === 'pow' && typeof value === 'number') {
    const power = 2;
    const normalized =
      (Math.pow(value, power) - Math.pow(domainMin, power)) /
      (Math.pow(domainMax, power) - Math.pow(domainMin, power));
    return rangeMin + normalized * width;
  }

  if (scaleType === 'band' && typeof value === 'number') {
    const step = width / domainData.length;
    const index = domainData.indexOf(value as number & Date);

    // TODO: fix

    return rangeMin + index * step;
  }

  if (scaleType === 'point' && typeof value === 'number') {
    const step = width / domainData.length;
    const index = domainData.indexOf(value as number & Date);
    return rangeMin + index * step;
  }

  if (scaleType === 'time' || (scaleType === 'utc' && !!value)) {
    const normalized =
      (new Date((value || '').toString()).getTime() - domainMin) /
      (domainMax - domainMin);
    return rangeMin + normalized * width;
  }

  return rangeMin;
};

const formatTick = (value: string | number | Date, scaleType: ScaleType) => {
  if (scaleType === 'time' || scaleType === 'utc') {
    return new Date(value).toISOString().split('T')[0];
  }
  return parseInt(value.toString());
};

const xAxes = computed(() => {
  const { width, bottom } = chartBounds.value;

  const xAxesWithData = props.xAxis.map(axis => {
    const { scaleType, dataKey, data: axisData } = axis;
    const axisSaleType = scaleType || ('linear' as ScaleType);
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

    const ticks = generateTicks(min, max, steps, axisSaleType, data);

    const stepWidth = width / steps;

    const labelsPosition = ticks.map(label => {
      const scaleX = scale(
        label as number & Date,
        'x',
        axisSaleType,
        ticks as AxisDataType<ScaleType>,
      );

      return {
        label,
        x: scaleX,
        y: 0,
        tickX: 0,
        tickY: 6,
        labelX: scaleType === 'band' ? stepWidth / 2 : 0,
        labelY: 9,
      };
    });

    const position = {
      x: 0,
      y: bottom,
    };

    return {
      ...axis,
      scaleType: axisSaleType,
      data,
      ...position,
      labels: labelsPosition,
    };
  });

  return xAxesWithData;
});

const xAxisLabels = computed(() => {
  const xAxis = props.xAxis.map(axis => {
    let data = (axis.data || []) as AxisDataType<ScaleType>;

    if (axis.dataKey && props.dataset) {
      data = props.dataset.map(p =>
        getNestedProperty(p, [axis.dataKey?.toString() || '']),
      ) as AxisDataType<ScaleType>;
    }

    return {
      ...axis,
      data,
    };
  });

  const labels = [
    ...(xAxis.flatMap(({ data }) => data).length
      ? xAxis[0].data
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

const yAxisLabels = computed(() => {
  const { height, top } = chartBounds.value;

  const steps = 5;
  const stepHeight = height / steps;

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
      y: top + index * stepHeight,
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
        // const axisPosition = xAxes.value[0].labels.find(
        //   ({ label }) => parseInt(label.toString()) === value,
        // );

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
        ) in axis.labels"
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
          {{ formatTick(label, axis.scaleType) }}
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
    <g :transform="`translate(${chartBounds.left}, 0)`">
      <line
        :y1="chartBounds.top"
        :y2="chartBounds.bottom"
        shape-rendering="crispEdges"
        class="stroke-white"
        stroke-linecap="square"
      />
      <!-- <g
        v-for="(value, index) in yAxisTicks"
        :key="'y-axis-' + index"
        :transform="`translate(0, ${mapToSvg('y', value)})`"
      >
        <line x2="-6" stroke="white" />
        <text
          x="-8"
          y="0"
          class="text-xs fill-white"
          text-anchor="end"
          dominant-baseline="central"
        >
          {{ formatTick(value, 'linear') }}
        </text>
      </g> -->

      <g
        v-for="({ label, x, y }, index) in yAxisLabels"
        :key="'y-tick-' + index"
        :transform="`translate(${x}, ${y})`"
      >
        <line x2="-6" shape-rendering="crispEdges" class="stroke-white"></line>
        <text
          class="text-xs fill-white"
          x="-8"
          y="0"
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
