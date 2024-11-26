export type ScaleTypes =
  | 'band'
  | 'linear'
  | 'log'
  | 'point'
  | 'pow'
  | 'sqrt'
  | 'time'
  | 'utc';

export const generateTicks = (
  min: number,
  max: number,
  numTicks: number,
  scaleType: ScaleTypes,
) => {
  if (scaleType === 'log') {
    // Log scale requires a logarithmic progression
    const logTicks = [];
    const minLog = Math.ceil(Math.log10(min));
    const maxLog = Math.floor(Math.log10(max));

    for (let i = minLog; i <= maxLog; i++) {
      logTicks.push({ value: Math.pow(10, i), index: i });
    }

    return logTicks;
  }

  if (scaleType === 'time' || scaleType === 'utc') {
    const step = (max - min) / (numTicks - 1);
    return Array.from({ length: numTicks }, (_, i) => ({
      value: new Date(new Date(min).getTime() + i * step),
      index: i,
    }));
  }

  const range = max - min;

  const roughStep = range / Math.max(5, numTicks);
  const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)));
  const step = Math.ceil(roughStep / magnitude) * magnitude;

  const start = Math.floor(min / step) * step;
  const end = Math.ceil(max / step) * step;

  const ticks = [];

  for (let tick = start; tick <= end; tick += step) {
    const index = tick / step;

    ticks.push({ value: tick, index });
  }

  return ticks;
};

export const generatePath = (
  points: { x: number; y: number }[],
  interpolation:
    | 'catmullRom'
    | 'linear'
    | 'monotoneX'
    | 'monotoneY'
    | 'natural'
    | 'step'
    | 'stepBefore'
    | 'stepAfter',
): string => {
  console.log('NATURLA', interpolation);
  if (interpolation === 'linear') {
    // Create a simple linear path
    return points
      .map((point, i) =>
        i === 0 ? `M${point.x},${point.y}` : `L${point.x},${point.y}`,
      )
      .join(' ');
  }

  if (interpolation === 'catmullRom') {
    return calculateCatmullRomPath(points, 0.5);
  }

  if (interpolation === 'monotoneX' || interpolation === 'monotoneY') {
    // Monotone cubic spline
    // Uses d3-style interpolation logic; you can implement a manual version or leverage d3
    return calculateMonotonePath(points, interpolation === 'monotoneY');
  }

  if (interpolation === 'natural') {
    return calculateNaturalSpline(points);
  }

  if (interpolation === 'step') {
    // Step interpolation
    return points.reduce(
      (path, point, i) =>
        i === 0 ? `M${point.x},${point.y}` : `${path} H${point.x} V${point.y}`,
      '',
    );
  }

  if (interpolation === 'stepBefore') {
    // Step-before interpolation
    return points.reduce(
      (path, point, i, arr) =>
        i === 0
          ? `M${point.x},${point.y}`
          : `${path} V${arr[i - 1].y} H${point.x}`,
      '',
    );
  }

  if (interpolation === 'stepAfter') {
    // Step-after interpolation
    return points.reduce(
      (path, point, i) =>
        i === 0 ? `M${point.x},${point.y}` : `${path} H${point.x} V${point.y}`,
      '',
    );
  }

  // Default fallback (linear)
  return points
    .map((point, i) =>
      i === 0 ? `M${point.x},${point.y}` : `L${point.x},${point.y}`,
    )
    .join(' ');
};

const calculateMonotonePath = (
  points: { x: number; y: number }[],
  isY: boolean = false,
): string => {
  if (points.length < 2) return '';

  const path: string[] = [`M${points[0].x},${points[0].y}`];
  const n = points.length;

  // Calculate tangents
  const tangents: { x: number; y: number }[] = new Array(n).fill({
    x: 0,
    y: 0,
  });

  for (let i = 1; i < n - 1; i++) {
    const p0 = points[i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    // const dx = p2.x - p0.x;
    const dy = p2.y - p0.y;

    const slope = isY ? dy / (p1.y - p0.y || 1e-6) : dy / (p1.x - p0.x || 1e-6);
    tangents[i] = { x: slope, y: slope };
  }

  // Adjust first and last tangent
  tangents[0] = {
    x: (points[1].x - points[0].x) / 2,
    y: (points[1].y - points[0].y) / 2,
  };
  tangents[n - 1] = {
    x: (points[n - 1].x - points[n - 2].x) / 2,
    y: (points[n - 1].y - points[n - 2].y) / 2,
  };

  // Build the cubic Bezier path
  for (let i = 0; i < n - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const t0 = tangents[i];
    const t1 = tangents[i + 1];

    const cp1x = p0.x + t0.x / 3;
    const cp1y = p0.y + t0.y / 3;
    const cp2x = p1.x - t1.x / 3;
    const cp2y = p1.y - t1.y / 3;

    path.push(`C${cp1x},${cp1y} ${cp2x},${cp2y} ${p1.x},${p1.y}`);
  }

  return path.join(' ');
};

const calculateNaturalSpline = (points: { x: number; y: number }[]): string => {
  const paths = [`M ${points[0].x},${points[0].y}`];

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cp1X = p0.x + (p1.x - p0.x) / 2;
    const cp1Y = p0.y;
    const cp2X = p1.x - (p1.x - p0.x) / 2;
    const cp2Y = p1.y;

    paths.push(`C ${cp1X},${cp1Y} ${cp2X},${cp2Y} ${p1.x},${p1.y}`);
  }

  return paths.join(' ');
};

const calculateCatmullRomPath = (
  points: { x: number; y: number }[],
  tension: number = 0.5,
): string => {
  if (points.length < 2) return '';

  const path: string[] = [`M${points[0].x},${points[0].y}`];

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i]; // Previous point or duplicate first
    const p1 = points[i]; // Current point
    const p2 = points[i + 1] || points[i]; // Next point or duplicate last
    const p3 = points[i + 2] || p2; // Point after next or duplicate last

    // Calculate control points for the spline
    const cp1x = p1.x + ((p2.x - p0.x) * tension) / 6;
    const cp1y = p1.y + ((p2.y - p0.y) * tension) / 6;
    const cp2x = p2.x - ((p3.x - p1.x) * tension) / 6;
    const cp2y = p2.y - ((p3.y - p1.y) * tension) / 6;

    // Add cubic Bezier curve to the path
    path.push(`C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`);
  }

  return path.join(' ');
};
