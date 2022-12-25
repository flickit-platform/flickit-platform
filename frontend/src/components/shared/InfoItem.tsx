import React, { FC, PropsWithChildren } from "react";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import { styles } from "../../config/styles";
import { Box } from "@mui/material";

interface IInfoItems {
  renderMap?: Record<string, (...args: any) => JSX.Element>;
  component?: FC<{ title: string }>;
  info: { title: string; item: any | any[]; type?: string };
  bg?: "white";
}

const InfoItem = (props: IInfoItems) => {
  const { info, renderMap, component, bg } = props;

  return renderInfo(info, { component, renderMap, bg });
};

const DefaultInfoItemComponent = (
  props: PropsWithChildren<{ title: string; bg?: "white" }>
) => {
  const { title, children, bg } = props;
  return (
    <Typography
      mb={1}
      variant="body2"
      sx={{
        ...styles.centerV,
        fontFamily: "Roboto",
        background: bg || "#f5f2f2",
        py: 0.6,
        px: 1,
        borderRadius: 1,
      }}
      justifyContent="space-between"
    >
      {title}:{" "}
      <Box
        component="strong"
        sx={{
          py: 0.2,
          px: 0.6,
          background: "white",
          borderRadius: 1,
        }}
      >
        {children}
      </Box>
    </Typography>
  );
};

const defaultRenderMap: Record<string, (...args: any) => JSX.Element> = {
  tags: (title: string, items: string[], props: any) => (
    <DefaultInfoItemComponent title={title} {...props}>
      {items.map((item) => (
        <Chip size="small" label={item} sx={{ mr: 0.3 }} />
      ))}
    </DefaultInfoItemComponent>
  ),
  array: (title: string, items: string[], props: any) => (
    <DefaultInfoItemComponent title={title} {...props}>
      {items.map(
        (item, index) => `${item}${index === items.length - 1 ? "" : ","} `
      )}
    </DefaultInfoItemComponent>
  ),
};

const renderInfo = (
  info: { title: string; item: any | any[]; type?: string },
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
  const { title, item, type } = info;
  const key = useTitleAsFallbackType ? type || title : type;

  return key && renderMap[key] ? (
    renderMap[key](title, item, { bg })
  ) : (
    <Component title={title} bg={bg}>
      {item}
    </Component>
  );
};

export default InfoItem;
export { renderInfo };
