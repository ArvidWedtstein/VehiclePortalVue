import { getLanguage } from './utils';

export const getLocalDateISO = () => {
  return new Date(
    new Date().setHours(
      new Date().getHours() - new Date().getTimezoneOffset() / 60,
    ),
  ).toISOString();
};
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
      const dayOfWeek = result.getDay();
      const diff = (6 - dayOfWeek + (7 + startOn)) % 7;
      result.setDate(result.getDate() + diff);
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
  const formattedDateTime = new Date(dateTime).toLocaleString(getLanguage(), {
    timeStyle: timeStyle == 'none' ? undefined : timeStyle || 'short',
    dateStyle: dateStyle || 'long',
  });

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
  const start = new Date(startDate.setHours(0, 0, 0));
  const end = new Date(endDate.setHours(0, 0, 0));

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

/**
 *
 * @param date
 * @param unit
 * @returns "time" ago
 */
export const relativeDate = (
  date: Date | string,
  style?: Intl.RelativeTimeFormatStyle,
): string => {
  const now = new Date().getTime();
  const diffInSeconds = Math.floor((now - new Date(date).getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat(getLanguage(), {
    numeric: 'auto',
    localeMatcher: 'lookup',
    style: style,
  });

  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, 'second');
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return rtf.format(-minutes, 'minute');
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return rtf.format(-hours, 'hour');
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return rtf.format(-days, 'day');
  }
};

export const toLocalPeriod = (date: Date): string => {
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}`;
};

export const toLocaleISODate = (date: Date | null) => {
  if (!date) return;
  return `${date.getFullYear()}-${(date.getMonth() + 1 + '').padStart(
    2,
    '0',
  )}-${(date.getDate() + '').padStart(2, '0')}`;
};

export const getDateUnit = (
  type: 'weekday' | 'month' = 'weekday',
  firstDayOfWeek = 1,
): Date[] => {
  const days: Date[] = [];
  const date = new Date();

  // Set the date to the first day of the week (Monday)

  if (type === 'month') {
    date.setMonth(0);
  } else {
    date.setDate(date.getDate() - ((date.getDay() - firstDayOfWeek + 7) % 7));
  }

  // Get the weekdays (Monday to Sunday)
  for (let i = 0; i < (type === 'weekday' ? 7 : 12); i++) {
    days.push(new Date(date));
    if (type === 'weekday') {
      date.setDate(date.getDate() + 1);
    } else {
      date.setMonth(date.getMonth() + 1);
    }
  }

  return days;
};

export const addToDate = (
  date: Date | string,
  value: number = 0,
  unit: 'minutes' | 'hour' | 'day' | 'week' | 'month' | 'year' = 'day',
) => {
  const result = new Date(date);

  switch (unit) {
    case 'minutes':
      result.setMinutes(result.getMinutes() + value);
      break;
    case 'hour':
      result.setHours(result.getHours() + value);
      break;
    case 'day':
      result.setDate(result.getDate() + value);
    case 'week':
      result.setDate(result.getDate() + value * 7);
      break;
    case 'month':
      result.setMonth(result.getMonth() + value);
      break;
    case 'year':
      result.setFullYear(result.getFullYear() + value);
      break;
  }

  return result;
};

export const convertToDatetimeLocal = (isoDate: string): string => {
  const date = new Date(isoDate);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};
