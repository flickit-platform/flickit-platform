const convertToBytes = (bytes: number, format = "B") => {
  if (!+bytes) return 0;

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const findSize = (element: string) =>
    element.toLowerCase() === format.toLowerCase();
  const index =
    sizes.findIndex(findSize) !== -1 ? sizes.findIndex(findSize) : 0;
  return bytes * Math.pow(k, index);
};

export default convertToBytes;
