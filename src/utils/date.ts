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
  date: Date,
  type: 'start' | 'end',
  period: 'day' | 'week' | 'month' | 'year',
  startOn = 0,
): Date => {
  const result = new Date(date);

  if (type === 'start') {
    if (period === 'day') {
      result.setUTCHours(0, 0, 0, 0);
    } else if (period === 'week') {
      const dayOfWeek = result.getUTCDay();
      const diff = (dayOfWeek - startOn + 7) % 7;
      result.setUTCDate(result.getUTCDate() - diff);
    } else if (period === 'month') {
      result.setDate(1);
    } else if (period === 'year') {
      result.setUTCMonth(0, 1);
    }
  } else if (type === 'end') {
    if (period === 'day') {
      result.setUTCHours(23, 59, 59, 999);
    } else if (period === 'month') {
      result.setMonth(result.getMonth() + 1, 0);
    } else if (period === 'week') {
      const dayOfWeek = result.getUTCDay();
      const diff = (6 - dayOfWeek + 7) % 7;
      result.setUTCDate(result.getUTCDate() + diff);
    } else if (period === 'year') {
      result.setUTCMonth(11, 31);
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
