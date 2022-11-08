import * as React from "react";
import Popover, { PopoverProps } from "@mui/material/Popover";
import { PropsWithChildren } from "react";

interface IMetricPopoverProps extends PopoverProps {}

const MetricPopover = (props: PropsWithChildren<IMetricPopoverProps>) => {
  const { children, ...rest } = props;
  return (
    <div>
      <Popover
        {...rest}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        {children}
      </Popover>
    </div>
  );
};

export { MetricPopover };
