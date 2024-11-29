type ExtractKey<T> =
  T extends Array<infer U>
    ? U extends object
      ? keyof U
      : never
    : T extends object
      ? keyof T
      : never;

/**
 * Returns the sum of an array of numbers.
 *
 * @param {number[]} numbers - The array of numbers to sum.
 * @returns {number} The sum of the numbers in the array.
 *
 * @example
 * sum([1, 2, 3, 4]); // 10
 */
const sum = <
  T extends
    | (number | { [key: string]: unknown })[]
    | { [key: string]: unknown },
>(
  input: T,
  key?: ExtractKey<T>,
): number => {
  if (Array.isArray(input)) {
    return input.reduce((acc: number, item) => {
      if (typeof item === 'number') {
        return acc + item;
      }
      if (Array.isArray(item)) {
        return acc + sum(item, key as ExtractKey<typeof item>);
      }
      if (typeof item === 'object' && item !== null) {
        return acc + sum(item, key as ExtractKey<typeof item>);
      }
      return acc;
    }, 0);
  }

  if (typeof input === 'object' && input !== null) {
    let total = 0;

    // If a key is provided, sum the values of that key
    if (key) {
      if (key in input) {
        const value = input[key];
        if (typeof value === 'number') {
          total += value; // Add the numeric value of the key
          return total;
        }
      }
    }

    // Recursively sum values of nested objects or arrays
    for (const value of Object.values(input)) {
      if (typeof value === 'number') {
        total += value;
      } else if (Array.isArray(value)) {
        total += sum(value, key as ExtractKey<typeof value>);
      } else if (typeof value === 'object' && value !== null) {
        total += sum(
          value as { [key: string]: unknown },
          key as ExtractKey<typeof value>,
        );
      }
    }

    return total;
  }

  return 0;
};

/**
 * Returns the average (mean) of an array of numbers.
 *
 * @param {number[]} numbers - The array of numbers to calculate the average of.
 * @returns {number} The average of the numbers in the array.
 * @throws {Error} Throws an error if the array is empty.
 *
 * @example
 * average([1, 2, 3, 4]); // 2.5
 */
const average = (numbers: number[]) => {
  if (numbers.length === 0) return 0;
  return sum(numbers) / numbers.length;
};

/**
 * Returns the median of an array of numbers.
 * The median is the middle number when the array is sorted.
 * If the array has an even length, the median is the average of the two middle numbers.
 *
 * @param {number[]} numbers - The array of numbers to calculate the median of.
 * @returns {number} The median of the numbers in the array.
 * @throws {Error} Throws an error if the array is empty.
 *
 * @example
 * median([1, 2, 3, 4, 5]); // 3
 * median([1, 2, 3, 4]); // 2.5
 */
const median = (numbers: number[]): number => {
  if (numbers.length === 0) throw new Error('Array cannot be empty');
  const sorted = numbers.slice().sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  } else {
    return sorted[middle];
  }
};

/**
 * Returns the mode(s) of an array of numbers.
 * The mode is the number that appears most frequently in the array.
 * If there are multiple modes, returns all of them in an array.
 *
 * @param {number[]} numbers - The array of numbers to calculate the mode(s) of.
 * @returns {number[]} An array containing the mode(s).
 *
 * @example
 * mode([1, 2, 2, 3, 4]); // [2]
 * mode([1, 1, 2, 2, 3]); // [1, 2]
 */
const mode = (numbers: number[]): number[] => {
  const frequency: { [key: number]: number } = {};
  let maxFreq = 0;

  numbers.forEach(num => {
    frequency[num] = (frequency[num] || 0) + 1;
    maxFreq = Math.max(maxFreq, frequency[num]);
  });

  return Object.keys(frequency)
    .filter(key => frequency[+key] === maxFreq)
    .map(key => +key);
};

/**
 * Returns the factorial of a given number.
 *
 * @param {number} n - The number to calculate the factorial of.
 * @returns {number} The factorial of the number.
 * @throws {Error} Throws an error if n is a negative number.
 *
 * @example
 * factorial(5); // 120
 */
const factorial = (n: number): number => {
  if (n < 0) throw new Error('Factorial is not defined for negative numbers');
  return n === 0 ? 1 : n * factorial(n - 1);
};

/**
 * Returns the greatest common divisor (GCD) of two numbers.
 *
 * @param {number} a - The first number.
 * @param {number} b - The second number.
 * @returns {number} The greatest common divisor of a and b.
 *
 * @example
 * gcd(36, 60); // 12
 */
const gcd = (a: number, b: number): number => {
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
};

/**
 * Returns the least common multiple (LCM) of two numbers.
 *
 * @param {number} a - The first number.
 * @param {number} b - The second number.
 * @returns {number} The least common multiple of a and b.
 *
 * @example
 * lcm(12, 15); // 60
 */
const lcm = (a: number, b: number): number => {
  return (a * b) / gcd(a, b);
};

/**
 * Checks if a number is a prime number.
 *
 * @param {number} n - The number to check.
 * @returns {boolean} True if the number is prime, otherwise false.
 * @throws {Error} Throws an error if n is less than 2.
 *
 * @example
 * isPrime(7); // true
 * isPrime(10); // false
 */
const isPrime = (n: number): boolean => {
  if (n < 2) throw new Error('Prime numbers are greater than 1');
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false;
  }
  return true;
};

/**
 * Returns the nth Fibonacci number.
 *
 * @param {number} n - The index of the Fibonacci sequence to return.
 * @returns {number} The nth Fibonacci number.
 * @throws {Error} Throws an error if n is a negative number.
 *
 * @example
 * fibonacci(5); // 5
 */
const fib = (n: number): number => {
  if (n < 0) throw new Error('Fibonacci is not defined for negative numbers');
  if (n === 0) return 0;
  if (n === 1) return 1;

  let a = 0,
    b = 1;
  for (let i = 2; i <= n; i++) {
    const temp = a + b;
    a = b;
    b = temp;
  }
  return b;
};

/**
 * Rounds a number to the nearest decimal place.
 *
 * @param {number} num - The number to round.
 * @param {number} places - The number of decimal places to round to.
 * @returns {number} The rounded number.
 *
 * @example
 * roundTo(3.14159, 2); // 3.14
 */
const roundTo = (num: number, places: number): number => {
  const factor = Math.pow(10, places);
  return Math.round(num * factor) / factor;
};

export {
  sum,
  average,
  median,
  mode,
  factorial,
  gcd,
  lcm,
  isPrime,
  fib,
  roundTo,
};
