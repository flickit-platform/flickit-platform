import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import React, { FC } from "react";
import { styles } from "../../../config/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface IListAccordion {
  items: any[];
  renderItem: (item: any, index: number, isExpanded: boolean) => JSX.Element;
  LiComponent?: FC<{ render: (expanded: boolean) => JSX.Element }>;
}

const ListAccordion = (props: IListAccordion) => {
  const { items, renderItem, LiComponent = UnOrderedListAccordionItem } = props;

  return (
    <ul>
      {items.map((item: any, index: number) => {
        return (
          <LiComponent
            render={(isExpanded) => renderItem(item, index, isExpanded)}
            key={index}
          />
        );
      })}
    </ul>
  );
};

const UnOrderedListAccordionItem = (props: {
  render: (expanded: boolean) => JSX.Element;
}) => {
  const { render } = props;
  const [expanded, setExpanded] = React.useState<boolean>(false);

  return (
    <Box
      component="li"
      sx={{
        marginBottom: "8px",
        backgroundColor: "white",
        borderRadius: "8px",
        position: "relative",
      }}
    >
      <Box
        position="absolute"
        sx={{
          left: 0,
          width: "100%",
          cursor: "pointer",
          zIndex: 1,
          paddingRight: "10px",
          height: "56px",
          borderRadius: 2,
          ...styles.centerV,
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <ExpandMoreIcon
          sx={{
            ml: "auto",
            color: "#287c71",
            transition: "transform .5s ease",
            transform: expanded ? "rotate(540deg)" : "rotate(0)",
          }}
        />
      </Box>
      <Collapse in={expanded} collapsedSize={56} sx={{ padding: 2 }}>
        {render(expanded)}
      </Collapse>
    </Box>
  );
};

export default ListAccordion;
