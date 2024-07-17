export const calculateFontSize = (length: number): string => {
  const maxLength = 20; // Example threshold for maximum length
  const minLength = 12; // Example threshold for minimum length
  let maxFontSizeRem = 3; // 24px / 16 = 1.5rem
  let minFontSizeRem = 2.25; // 18px / 16 = 1.125rem

  if (length <= minLength) return `${maxFontSizeRem}rem`;
  if (length >= maxLength) return `${minFontSizeRem}rem`;

  const fontSizeRem =
    maxFontSizeRem -
    ((length - minLength) / (maxLength - minLength)) *
      (maxFontSizeRem - minFontSizeRem);
  return `${fontSizeRem}rem`;
};
