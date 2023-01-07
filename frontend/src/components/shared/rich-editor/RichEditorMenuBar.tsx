import { Box } from "@mui/material";
import { Editor } from "@tiptap/react";
import RichEditorMenuItem, { IRichEditorMenuItem } from "./RichEditorMenuItem";
import defaultGetMenuItems from "./defaultGetMenuItems";

interface IRichEditorMenuBarProps {
  editor: Editor;
  getMenuItems?: (
    editor: Editor
  ) => (IRichEditorMenuItem | { type: "divider" })[];
}

const RichEditorMenuBar = (props: IRichEditorMenuBarProps) => {
  const { editor, getMenuItems = defaultGetMenuItems } = props;

  const menuItems = getMenuItems(editor);

  return (
    <Box
      className="rich-editor--menu"
      sx={{
        display: "flex",
        flexWrap: "wrap",
        position: "absolute",
        background: "white",
        zIndex: -1,
        right: 0,
        opacity: 0,
        top: "-8px",
        transform: "translateY(-100%)",
        py: 0.5,
        px: 0.6,
        maxWidth: "100%",
        boxShadow: " 2px 2px 12px -3px #9d9d9d61",
        borderRadius: 1,
        transition: "z-index .2s .1s ease, opacity .2s .1s ease",
      }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onFocus={(e) => e.preventDefault()}
      tabIndex={-1}
    >
      {menuItems.map((menuItem, index) => (
        <Box
          key={index}
          sx={{ display: "flex", flexWrap: "wrap" }}
          onFocus={(e) => e.preventDefault()}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          {menuItem.type === "divider" ? (
            <Box
              sx={{
                height: "20px",
                width: "1px",
                backgroundColor: "#f1f1f1",
                my: 1,
                mx: 0.6,
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            />
          ) : (
            <RichEditorMenuItem menuItem={menuItem} />
          )}
        </Box>
      ))}
    </Box>
  );
};

export default RichEditorMenuBar;
