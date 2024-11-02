export const maskInput = (value: string, mask: string) => {
  const maskChars = {
    '#': /\d/,               // Numeric characters (0-9)
    'A': /[A-Z]/,            // Uppercase alphabet characters (A-Z)
    'a': /[a-z]/,            // Lowercase alphabet characters (a-z)
    'X': /[A-Za-z0-9]/       // Alphanumeric characters (A-Z, a-z, 0-9)
  };

  let masked = '';
  let valueIndex = 0;

  for (let i = 0; i < mask.length; i++) {
    const maskChar = mask[i];
    const valueChar = value[valueIndex];
    if (maskChar in maskChars) {
      // Check if the current character matches the mask requirement
      if (valueChar && maskChars[maskChar as keyof typeof maskChars].test(valueChar)) {
        masked += valueChar;
        valueIndex++;
      }
    } else {
      // Add mask symbols (e.g., spaces, dashes) directly
      masked += maskChar;
      if (valueChar === maskChar) valueIndex++; // Move index if the symbol matches
    }
  }

  return masked;
}