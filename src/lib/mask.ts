export const maskInput = (value: string, mask: string) => {
  const digits = value.replace(/\D/g, '');
  let masked = '';
  let digitIndex = 0;

  for (let i = 0; i < mask.length; i++) {
    if (mask[i] === '#') {
      if (digitIndex < digits.length) {
        masked += digits[digitIndex++];
      }
    } else {
      masked += mask[i];
    }
  }
  
  return masked;
}