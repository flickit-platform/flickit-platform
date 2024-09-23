const forLoopComponent = (
  numberOfIterations: number,
  cb: (index: number) => JSX.Element,
) => {
  const components: JSX.Element[] = [];
  for (let index = 0; index < numberOfIterations; index++) {
    components[index] = cb(index);
  }
  return components;
};

export default forLoopComponent;
