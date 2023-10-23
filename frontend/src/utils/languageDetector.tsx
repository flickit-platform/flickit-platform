const languageDetector = (text: string) => {
  const farsiChars = new Set("ابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی");
  const englishChars = new Set(
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
  );
  const farsiCount = Array.from(text).filter((char) =>
    farsiChars.has(char)
  ).length;
  const englishCount = Array.from(text).filter((char) =>
    englishChars.has(char)
  ).length;
  if (farsiCount > englishCount) {
    return true;
  } else if (englishCount > farsiCount) {
    return false;
  }
};

export default languageDetector;
