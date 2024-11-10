export const groupBy = <T extends Record<string, unknown>>(
  array: T[],
  key: keyof T | string,
): { [groupKey: string]: T[] } => {
  // Convert `key` to array of strings for strict indexing compatibility
  const nestedKeys =
    typeof key === 'string' ? key.split('.') : [key as unknown as string];

  // Helper function to safely access nested properties with strict typing
  const getNestedProperty = (
    obj: Record<string, unknown>,
    keys: string[],
  ): unknown => {
    return keys.reduce((acc: unknown, currentKey: string) => {
      // Ensure acc is a Record<string, unknown> for safe nested access
      if (acc && typeof acc === 'object' && currentKey in acc) {
        return (acc as Record<string, unknown>)[currentKey];
      }
      return undefined;
    }, obj);
  };

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

export const getLanguage = () =>
  navigator.language || (navigator.languages || ['en'])[0];

/**
 *
 * @param a bytes
 * @param b decimals
 * @returns formatted byte number
 */
export const formatBytes = (a: number, b = 2) => {
  if (!+a) return '0 Bytes';
  const c = 0 > b ? 0 : b,
    d = Math.floor(Math.log(a) / Math.log(1024));
  return `${parseFloat((a / Math.pow(1024, d)).toFixed(c))} ${
    ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'][d]
  }`;
};

export const stripDiacritics = (string: string) => {
  return typeof string.normalize !== 'undefined'
    ? string.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    : string;
};
