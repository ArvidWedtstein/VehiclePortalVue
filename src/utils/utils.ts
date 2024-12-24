import { vehicleManufacturersCodes } from './vehicleManufacturerCodes';

/**
 * Returns a pluralized string based on the count and noun provided.
 *
 * @param {number} count - The number of items.
 * @param {string} noun - The noun to be pluralized.
 * @param {string} [suffix='s'] - The suffix to be added to the noun.
 * @param {boolean} [includeCount=true] - The suffix to be added to the noun.
 * @return {string} - The pluralized string.
 */
export const pluralize = (
  count: number,
  noun: string,
  suffix = 's',
  includeCount: boolean = true,
): string => `${includeCount ? count : ''} ${noun}${count !== 1 ? suffix : ''}`;

// Helper function to safely access nested properties with strict typing
export const getNestedProperty = <
  T extends Record<string, unknown>, // Base object type
  K extends Array<keyof T>, // Array of keys (generic)
>(
  obj: T,
  keys: K,
) => {
  return keys.reduce<unknown>((acc, currentKey) => {
    if (acc && typeof acc === 'object' && currentKey in acc) {
      return (acc as Record<string, unknown>)[currentKey as string];
    }
    return undefined;
  }, obj);
};

export const groupBy = <T extends Record<string, unknown>>(
  array: T[],
  key: keyof T | string,
): { [groupKey: string]: T[] } => {
  // Convert `key` to array of strings for strict indexing compatibility
  const nestedKeys =
    typeof key === 'string' ? key.split('.') : [key as unknown as string];

  return array.reduce((acc: { [groupKey: string]: T[] }, obj: T) => {
    // Retrieve the group key by accessing nested properties
    const groupKey = getNestedProperty(obj, nestedKeys);

    // Convert groupKey to string for use as an object key
    const groupKeyStr = String(groupKey);

    // Initialize the group if it doesn't already exist in the accumulator
    if (!acc[groupKeyStr]) {
      acc[groupKeyStr] = [];
    }

    // Add the object to the correct group
    acc[groupKeyStr].push(obj);
    return acc;
  }, {});
};

/**
 * @description Dabounce
 * @param func
 * @param delay
 * @returns
 */
export const debounce = <T extends (...args: unknown[]) => void>(
  func: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>): void => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Converts array type to single type
 */
export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export type ColumnsToReturn<T, C> = C extends '*'
  ? T
  : Pick<T, Extract<C, keyof T>>;

export type FilterKeys<T> = {
  [K in keyof T]?: T[K];
};

export const getLanguage = () => {
  return (
    Intl.DateTimeFormat().resolvedOptions().locale ||
    navigator.language ||
    (navigator.languages || ['en'])[0]
  );
};

export const stripDiacritics = (string: string) => {
  return typeof string.normalize !== 'undefined'
    ? string.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    : string;
};

export const generateDistinctColors = (numColors: number): string[] => {
  const colors: string[] = [];

  const lightness = 30;
  const saturation = 70;

  for (let i = 0; i < numColors; i++) {
    // Space hues to ensure colors are evenly distributed
    const hue = (i * (360 / numColors)) % 360;

    const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

    colors.push(color);
  }

  return colors;
};

type Change<T> = {
  field: keyof T;
  oldValue: T[keyof T] | undefined;
  newValue: T[keyof T] | undefined;
};

export const calculateJsonChanges = <T>(
  oldValues: Partial<T> | undefined,
  newValues: Partial<T> | undefined,
): Change<T>[] => {
  const changes: Change<T>[] = [];

  // Get the union of all keys from old and new
  const allKeys = new Set<keyof T>([
    ...(oldValues ? Object.keys(oldValues) : []),
    ...(newValues ? Object.keys(newValues) : []),
  ] as (keyof T)[]);

  // Compare values for each key
  for (const key of allKeys) {
    const oldValue = oldValues?.[key];
    const newValue = newValues?.[key];

    if (oldValue !== newValue) {
      changes.push({
        field: key,
        oldValue,
        newValue,
      });
    }
  }

  return changes;
};

/**
 * Extracts initials from a given name.
 * @param name The full name from which to extract initials.
 * @param maxInitials The maximum number of initials to include (default is 2).
 * @returns The initials as a string.
 */
export const getInitials = (name: string, maxInitials: number = 2): string => {
  if (!name.trim()) {
    return '';
  }

  const words = name.trim().split(/\s+/);

  const initials = words
    .slice(0, maxInitials)
    .map(word => word[0].toUpperCase());

  return initials.join('');
};

type VINData = {
  country: string;
  manufacturer: string;
  vehicleType: string;
  modelYear: number;
  plantCode: string;
  sequentialNumber: string;
};

export const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;

/**
 * Decodes a Vehicle Identification Number (VIN) and returns the data.
 * @param vin The VIN to decode.
 * @returns The decoded VIN data.
 */
export const decodeVIN = (vin: string): VINData | null => {
  if (!vinRegex.test(vin)) {
    console.error('Invalid VIN format.');
    return null;
  }

  const worldManufacturerCode = vin.slice(0, 3);
  const vehicleDescriptorSection = vin.slice(3, 9);
  // const vehicleIdentifierSection = vin.slice(9, 17);

  const countryCode = vin[0];
  const yearCode = vin[9];
  const plantCode = vin[10];
  const sequentialNumber = vin.slice(11);

  const countries: Record<string, string> = {
    '1': 'USA',
    '2': 'Canada',
    '3': 'Mexico',
    '4': 'USA',
    '5': 'USA',
    '6': 'Australia',
    '7': 'New Zealand',
    '8': 'Argentina',
    '9': 'Brazil',
    A: 'South Africa',
    B: 'Angola',
    C: 'Benin',
    D: 'Egypt',
    E: 'Ethiopia',
    F: 'Ghana',
    G: 'Nigeria',
    H: 'Kenya',
    J: 'Japan',
    K: 'South Korea',
    L: 'China',
    M: 'India',
    N: 'Turkey',
    P: 'Philippines',
    R: 'Russia',
    S: 'United Kingdom',
    T: 'Switzerland',
    U: 'Denmark',
    V: 'France',
    W: 'Germany',
    X: 'Bulgaria',
    Y: 'Sweden',
    Z: 'Italy',
  };

  const vehicleManufacturer = vehicleManufacturersCodes
    .get(worldManufacturerCode)
    ?.split(' ')[0];

  const years: Record<string, number> = {
    A: 1980,
    B: 1981,
    C: 1982,
    D: 1983,
    E: 1984,
    F: 1985,
    G: 1986,
    H: 1987,
    J: 1988,
    K: 1989,
    L: 1990,
    M: 1991,
    N: 1992,
    P: 1993,
    R: 1994,
    S: 1995,
    T: 1996,
    V: 1997,
    W: 1998,
    X: 1999,
    Y: 2000,
    1: 2001,
    2: 2002,
    3: 2003,
    4: 2004,
    5: 2005,
    6: 2006,
    7: 2007,
    8: 2008,
    9: 2009,
    0: 1980,
  };

  const adjustedYears: Record<string, number> = Object.fromEntries(
    Object.entries(years).filter(
      ([key], index, arr) => arr.findIndex(([k]) => k === key) === index,
    ),
  );

  return {
    country: countries[countryCode] || 'Unknown',
    manufacturer: vehicleManufacturer || worldManufacturerCode,
    vehicleType: vehicleDescriptorSection,
    modelYear: adjustedYears[yearCode] || 0,
    plantCode: plantCode,
    sequentialNumber: sequentialNumber,
  };
};
