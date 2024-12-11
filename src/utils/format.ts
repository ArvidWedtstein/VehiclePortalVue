import { getLanguage } from './utils';

export const formatFileSize = (size: number) => {
  if (size === 0) return `${size} B`;

  const i = Math.floor(Math.log(size) / Math.log(1024));
  return `${(size / Math.pow(1024, i)).toFixed(2)} ${['B', 'KB', 'MB', 'GB', 'TB'][i]}`;
};

/**
 * Formats a list of strings as a sentence with "or" as the final separator.
 * Similar to Intl.ListFormat with type: "disjunction" and style: "long".
 *
 * @param items - Array of strings to be formatted
 * @returns A formatted string, e.g., "JPG, PNG, or GIF"
 */
export const formatListDisjunction = (items: string[]): string => {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} or ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, or ${items[items.length - 1]}`;
};

/**
 * Formats numbers
 *
 * @param {number} num
 * @returns A formatted string of your number
 */
export const formatNumber = (
  num: number,
  options: Intl.NumberFormatOptions = { style: 'decimal' },
) => {
  const language = getLanguage();
  const formatter = new Intl.NumberFormat(language, options);

  return formatter.format(num);
};

type Bytes = 'bytes' | 'kilobytes' | 'megabytes' | 'gigabytes' | 'terabytes';

export const convertBytes = (value: number, fromUnit: Bytes, toUnit: Bytes) => {
  if (typeof value !== 'number' || value < 0) {
    throw new Error('Input must be a non-negative number.');
  }

  const units = {
    bytes: 1,
    kilobytes: 1024,
    megabytes: 1024 * 1024,
    gigabytes: 1024 * 1024 * 1024,
    terabytes: 1024 * 1024 * 1024 * 1024,
  };

  if (!units[fromUnit] || !units[toUnit]) {
    throw new Error(
      'Invalid unit specified. Supported units are: bytes, kilobytes, megabytes, gigabytes, terabytes.',
    );
  }

  return (value * units[fromUnit]) / units[toUnit];
};
