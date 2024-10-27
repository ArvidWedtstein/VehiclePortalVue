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
