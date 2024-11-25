export type ScaleTypes =
  | 'band'
  | 'linear'
  | 'log'
  | 'point'
  | 'pow'
  | 'sqrt'
  | 'time'
  | 'utc';

export const generateTicks = <T>(
  min: number,
  max: number,
  numTicks: number,
  scaleType: ScaleTypes,
  axisData: T[] = [],
) => {
  if (axisData?.length > 0) {
    return axisData;
  }

  if (scaleType === 'log') {
    // Log scale requires a logarithmic progression
    const logTicks = [];
    const minLog = Math.ceil(Math.log10(min));
    const maxLog = Math.floor(Math.log10(max));

    for (let i = minLog; i <= maxLog; i++) {
      logTicks.push(Math.pow(10, i));
    }

    return logTicks;
  }

  if (scaleType === 'time' || scaleType === 'utc') {
    const step = (max - min) / (numTicks - 1);
    return Array.from(
      { length: numTicks },
      (_, i) => new Date(new Date(min).getTime() + i * step),
    );
  }

  return Array.from(
    { length: numTicks },
    (_, i) => min + (i * (max - min)) / (numTicks - 1),
  );
};
