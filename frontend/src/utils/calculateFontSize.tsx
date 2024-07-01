export const calculateFontSize = (length: number): string => {
  const maxLength = 14; // Example threshold for maximum length
  const minLength = 8; // Example threshold for minimum length
  let maxFontSizeRem = 4; // 24px / 16 = 1.5rem
  let minFontSizeRem = 2; // 18px / 16 = 1.125rem

  if (length <= minLength) return `${maxFontSizeRem}rem`;
  if (length >= maxLength) return `${minFontSizeRem}rem`;

  const fontSizeRem =
    maxFontSizeRem -
    ((length - minLength) / (maxLength - minLength)) *
      (maxFontSizeRem - minFontSizeRem);
  return `${fontSizeRem}rem`;
};
