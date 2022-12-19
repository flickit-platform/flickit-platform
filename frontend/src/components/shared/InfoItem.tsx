import React, { FC, PropsWithChildren } from "react";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import { styles } from "../../config/styles";

interface IInfoItems {
  renderMap?: Record<string, (...args: any) => JSX.Element>;
  component?: FC<{ title: string }>;
  info: { title: string; item: any | any[]; type?: string };
}

const InfoItem = (props: IInfoItems) => {
  const { info, renderMap, component } = props;

  return renderInfo(info, { component, renderMap });
};

const DefaultInfoItemComponent = (
  props: PropsWithChildren<{ title: string }>
) => {
  const { title, children } = props;
  return (
    <Typography
      mb={1}
      variant="body2"
      sx={{ ...styles.centerV, fontFamily: "Roboto" }}
      justifyContent="space-between"
    >
      {title}: <strong>{children}</strong>
    </Typography>
  );
};

const defaultRenderMap: Record<string, (...args: any) => JSX.Element> = {
  tags: (title: string, items: string[]) => (
    <DefaultInfoItemComponent title={title}>
      {items.map((item) => (
        <Chip size="small" label={item} sx={{ mr: 0.3 }} />
      ))}
    </DefaultInfoItemComponent>
  ),
  array: (title: string, items: string[]) => (
    <DefaultInfoItemComponent title={title}>
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
  } = {}
) => {
  const {
    component: Component = DefaultInfoItemComponent,
    renderMap = defaultRenderMap,
    useTitleAsFallbackType,
  } = config;
  const { title, item, type } = info;
  const key = useTitleAsFallbackType ? type || title : type;

  return key && renderMap[key] ? (
    renderMap[key](title, item)
  ) : (
    <Component title={title}>{item}</Component>
  );
};

export default InfoItem;
export { renderInfo };
