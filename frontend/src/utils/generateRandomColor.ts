const generateRandomColor = () => {
  const hex = Math.floor(Math.random() * 0xffffff);
  const color = "#" + hex.toString(16);

  return color;
};

export default generateRandomColor;
