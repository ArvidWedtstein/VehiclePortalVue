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
  num: number | bigint,
  options: Intl.NumberFormatOptions = { style: 'decimal' },
) => {
  const language = getLanguage();
  try {
    const formatter = new Intl.NumberFormat(language, options);

    return formatter.format(num);
  } catch (error) {
    if (!error) return '';

    // Add all the extra units Intl doesn't support (yet)
    const extraUnits = {
      // Volume
      'cubic-millimeter': 'mm³',
      'cubic-centimeter': 'cm³',
      'cubic-meter': 'm³',
      'cubic-kilometer': 'km³',
      'cubic-inch': 'in³',
      'cubic-foot': 'ft³',
      'cubic-yard': 'yd³',
      'meter-per-square-second': 'm/s²',
      knot: 'kn',
      pint: 'pt',
      quart: 'qt',
      tablespoon: 'tbsp',
      teaspoon: 'tsp',
      barrel: 'bbl',
      karat: 'kt',
      // Power & Energy
      milliampere: 'mA',
      ampere: 'A',
      watt: 'W',
      milliwatt: 'mW',
      gigawatt: 'gW',
      volt: 'V',
      kilovolt: 'kV',
      megavolt: 'MV',
      gigavolt: 'GV',
      teravolt: 'TV',
      ohm: 'Ω',
      milliohm: 'mΩ',
      kilohm: 'kΩ',
      megohm: 'MΩ',
      gigohm: 'GΩ',
      joule: 'J',
      hertz: 'Hz',
      kilohertz: 'kHz',
      megahertz: 'MHz',
      gigahertz: 'GHz',
      terahertz: 'THz',
      horsepower: 'hp',
    };

    const extraUnit = (options.unit || '') as keyof typeof extraUnits;

    const unit = extraUnit in extraUnits ? extraUnits[extraUnit] : 'N/A';

    delete options.style;
    delete options.unit;

    const formatter = new Intl.NumberFormat(language, options);
    return `${formatter.format(num)} ${unit}`;
  }
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
