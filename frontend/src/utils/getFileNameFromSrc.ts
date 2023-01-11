const getFileNameFromSrc = (src: string) => {
  if (!src) {
    return "file";
  }
  const name = src.substring(src.lastIndexOf("/") + 1, src.length);
  return name;
};

export default getFileNameFromSrc;
