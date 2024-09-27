import React, { FC, PropsWithChildren } from "react";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import { styles } from "@styles";
import Box from "@mui/material/Box";

interface IInfoItems {
  renderMap?: Record<string, (...args: any) => JSX.Element>;
  component?: FC<{ title: string }>;
  info: {
    title: string;
    item: any | any[];
    type?: string;
    action?: JSX.Element;
  };
  bg?: "white";
}

const InfoItem = (props: IInfoItems) => {
  const { info, renderMap, component, bg } = props;

  return renderInfo(info, { component, renderMap, bg });
};

const DefaultInfoItemComponent = (
  props: PropsWithChildren<{
    title: string;
    bg?: "white";
    itemBg?: string;
    action?: JSX.Element;
  }>
) => {
  const { title, children, bg, itemBg, action } = props;
  return (
    <Typography
      mb={1}
      variant="body2"
      sx={{
        ...styles.centerV,
        background: bg || "#f5f2f2",
        py: 0.6,
        px: 1,
        borderRadius: 1,
        alignItems: "baseline",
      }}
      justifyContent="space-between"
    >
      {title}:{" "}
      <Box
        component="strong"
        sx={{
          py: 0.2,
          px: 0.6,
          background: itemBg || "white",
          ...styles.centerV,
          borderRadius: 1,
        }}
      >
        {action && (
          <Box mx={0.5} component="span" display="block">
            {action}
          </Box>
        )}
        {children}
      </Box>
    </Typography>
  );
};

const defaultRenderMap: Record<string, (...args: any) => JSX.Element> = {
  tags: (title: string, items: string[], props: any) => (
    <DefaultInfoItemComponent title={title} {...props}>
      {items.map((item) => (
        <Chip
          size="small"
          label={item}
          sx={{ ml: 0.3, mt: 0.5 }}
          component="span"
        />
      ))}
    </DefaultInfoItemComponent>
  ),
  array: (title: string, items: string[], props: any) => (
    <DefaultInfoItemComponent title={title} {...props}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "start",
          flexWrap: "wrap",
          ml: 4,
        }}
      >
        {items.map(
          (item, index) => `${item}${index === items.length - 1 ? "" : ","} `
        )}
      </Box>
    </DefaultInfoItemComponent>
  ),
};

const renderInfo = (
  info: {
    title: string;
    item: any | any[];
    type?: string;
    action?: JSX.Element;
  },
  config: {
    component?: any;
    renderMap?: any;
    useTitleAsFallbackType?: boolean;
    bg?: "white";
  } = {}
) => {
  const {
    component: Component = DefaultInfoItemComponent,
    renderMap = defaultRenderMap,
    useTitleAsFallbackType,
    bg,
  } = config;
  const { title, item, type, action } = info;
  const key = useTitleAsFallbackType ? type || title : type;

  return key && renderMap[key] ? (
    renderMap[key](title, item, { bg, action })
  ) : (
    <Component title={title} bg={bg} action={action}>
      {item}
    </Component>
  );
};

export default InfoItem;
export { renderInfo };
