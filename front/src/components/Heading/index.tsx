import React, { PropsWithChildren } from "react";

interface IHeading {}

const Heading = (props: PropsWithChildren<IHeading>) => {
  const { children } = props;

  return <div>{children}</div>;
};

Heading.Right = () => {
  return <div>Heading Right</div>;
};

Heading.Left = () => {
  return <div>Heading Left</div>;
};

export default Heading;
