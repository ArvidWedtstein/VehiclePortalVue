export const timeFormatL = (seconds: number, onlyLast: boolean = false) => {
  let time = '';
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const sec = seconds % 60;

  if (days > 0) {
    time += `${days}d `;
    if (onlyLast) {
      return time.trim().split(' ').pop();
    }
  }
  if (hours > 0) {
    time += `${hours}h `;
    if (onlyLast) {
      return time.trim().split(' ').pop();
    }
  }

  if (minutes > 0) {
    time += `${minutes}m `;
    if (onlyLast) {
      return time.trim().split(' ').pop();
    }
  }
  if (sec > 0 || time === '') {
    time += `${Math.round(sec)}s`;
  }
  return time.trim();
};

/**
 * Get Start or End of a period
 * @param date
 * @param type
 * @param period
 * @param startOn
 * @returns
 */
export const adjustCalendarDate = (
  type: 'start' | 'end',
  period: 'day' | 'week' | 'month' | 'year' = 'day',
  date: Date = new Date(),
  startOn = 0,
): Date => {
  const result = new Date(date);

  if (type === 'start') {
    if (period === 'day') {
      result.setHours(0, 0, 0, 0);
    } else if (period === 'week') {
      const dayOfWeek = result.getUTCDay();
      const diff = (dayOfWeek - startOn + 7) % 7;
      result.setDate(result.getUTCDate() - diff);
    } else if (period === 'month') {
      result.setDate(1);
    } else if (period === 'year') {
      result.setMonth(0, 1);
      result.setHours(0, 0, 0);
    }
  } else if (type === 'end') {
    if (period === 'day') {
      result.setHours(23, 59, 59, 999);
    } else if (period === 'month') {
      result.setMonth(result.getMonth() + 1, 0);
    } else if (period === 'week') {
      const dayOfWeek = result.getUTCDay();
      const diff = (6 - dayOfWeek + 7) % 7;
      result.setDate(result.getUTCDate() + diff);
    } else if (period === 'year') {
      result.setMonth(11, 31);
      // result.setUTCHours(2, 0, 0, 0);
    }
  }

  return result;
};

interface options {
  dateStyle?: 'long' | 'short' | 'full' | 'medium';
  timeStyle?: 'long' | 'short' | 'full' | 'medium' | 'none';
}

export const formatDate = (
  dateTime: string | Date,
  { dateStyle, timeStyle }: options = {},
) => {
  const formattedDateTime = new Date(dateTime).toLocaleString(
    navigator && navigator.language,
    {
      timeStyle: timeStyle == 'none' ? undefined : timeStyle || 'short',
      dateStyle: dateStyle || 'long',
    },
  );

  return formattedDateTime;
};

/**
 * Get the year, month, day, or week for the last n time periods.
 *
 * @param n - The number of time periods to go back.
 * @param unit - The unit of time ("days", "weeks", "months", "years").
 * @returns An array of objects, each containing year, month, day, or week based on the unit.
 */
export const getLastNTimePeriods = (
  n: number,
  unit: 'days' | 'weeks' | 'months' | 'years',
): { year: number; month?: number; day?: number; week?: number }[] => {
  const result: {
    year: number;
    month?: number;
    day?: number;
    week?: number;
  }[] = [];
  const currentDate = new Date();

  for (let i = 0; i < n; i++) {
    let date: Date;

    switch (unit) {
      case 'days':
        date = new Date(currentDate);
        date.setDate(currentDate.getDate() - i);
        result.push({
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate(),
        });
        break;

      case 'weeks':
        date = new Date(currentDate);
        date.setDate(currentDate.getDate() - i * 7);
        result.push({
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          week: Math.ceil(date.getDate() / 7), // Approximation of the week within the month
        });
        break;

      case 'months':
        date = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() - i,
          1,
        );
        result.push({
          year: date.getFullYear(),
          month: date.getMonth() + 1,
        });
        break;

      case 'years':
        date = new Date(currentDate.getFullYear() - i, 0, 1); // Start of the year
        result.push({
          year: date.getFullYear(),
        });
        break;

      default:
        throw new Error(
          "Invalid unit specified. Use 'days', 'weeks', 'months', or 'years'.",
        );
    }
  }

  return result;
};

type DateRangeResult<
  T extends 'months' | 'days' | 'years',
  R extends 'date' | 'object',
> = R extends 'date'
  ? Date[]
  : T extends 'days'
    ? { year: number; month: number; date: number }[]
    : T extends 'months'
      ? { year: number; month: number }[]
      : { year: number }[];

/**
 * Gets years, dates and months between two dates
 *
 * @param startDate
 * @param endDate
 * @param unit
 * @returns
 */
export const getRangeBetweenDates = <
  T extends 'months' | 'days' | 'years',
  R extends 'date' | 'object' = 'object',
>(
  startDate: Date,
  endDate: Date,
  unit: T,
  returnAs: R = 'object' as R,
): DateRangeResult<T, R> => {
  const result: (Date | { year: number; month?: number; date?: number })[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate.setHours(1, 0, 0));

  switch (unit) {
    case 'days': {
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        result.push(
          returnAs === 'date'
            ? new Date(d)
            : {
                date: d.getDate(),
                month: d.getMonth() + 1,
                year: d.getFullYear(),
              },
        );
      }
      break;
    }
    case 'months': {
      for (
        let m = new Date(start.getFullYear(), start.getMonth(), 1, 1);
        m <= new Date(end.getFullYear(), end.getMonth(), 1, 1);
        m.setMonth(m.getMonth() + 1, 1)
      ) {
        result.push(
          returnAs === 'date'
            ? new Date(m)
            : {
                month: m.getMonth(),
                year: m.getFullYear(),
              },
        );
      }
      break;
    }
    case 'years': {
      for (let year = start.getFullYear(); year <= end.getFullYear(); year++) {
        result.push(returnAs === 'date' ? new Date(year, 0, 1) : { year });
      }
      break;
    }
    default:
      throw new Error('Invalid unit specified');
  }

  return result as DateRangeResult<T, R>;
};
