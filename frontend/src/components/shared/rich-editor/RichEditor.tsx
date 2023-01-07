import { Box } from "@mui/material";
import { useEditor, EditorContent, EditorOptions } from "@tiptap/react";
import TextAlign from "@tiptap/extension-text-align";
import StarterKit from "@tiptap/starter-kit";
import RichEditorMenuBar from "./RichEditorMenuBar";
import Link from "@tiptap/extension-link";
import { useRef } from "react";
import { ControllerRenderProps, FieldValues } from "react-hook-form";

interface IRichEditorProps {
  defaultValue?: string;
  isEditable?: boolean;
  editorProps?: Partial<EditorOptions>;
  className?: string;
  field?: ControllerRenderProps<FieldValues, any>;
}

const RichEditor = (props: IRichEditorProps) => {
  const {
    defaultValue = "",
    isEditable = true,
    editorProps = {},
    className,
    field,
  } = props;

  const inputRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link,
    ],
    content: defaultValue,
    onUpdate(props) {
      if (!field) {
        return;
      }
      if (props.editor.getText()) {
        field.onChange(props.editor.getHTML());
      }
    },
    onCreate(props) {
      if (!field) {
        return;
      }
      if (props.editor.getText()) {
        field.onChange(props.editor.getHTML());
      }
    },
    onBlur(props) {
      if (!field) {
        return;
      }
      if (props.editor.getText()) {
        field.onChange(props.editor.getHTML());
      } else {
        field.onChange("");
      }
    },
    editorProps: {
      ...(editorProps?.editorProps || {}),
      attributes: {
        ...(editorProps?.editorProps?.attributes || {}),
        id: "proseMirror",
      },
    },
    editable: isEditable,
    ...editorProps,
  });

  return (
    <Box
      className={className}
      sx={{
        position: "relative",
        marginTop: "0px !important",
        width: "100%",
        mt: 1.5,
        "&.Mui-focused .ProseMirror": {
          borderColor: "#1976d2",
          borderWidth: "2px",
        },
        "&.Mui-focused:hover .ProseMirror": {
          borderColor: "#1976d2",
        },
        "&.Mui-error .ProseMirror": {
          borderColor: "#d32f2f",
        },
        "&.Mui-error:hover .ProseMirror": {
          borderColor: "#d32f2f",
        },
        "&:hover .ProseMirror": { borderColor: "rgba(0, 0, 0, 0.87)" },
        "& .rich-editor--menu": editor?.isFocused
          ? {
              opacity: 1,
              zIndex: 10,
            }
          : {},
        "&:hover .rich-editor--menu": {
          opacity: 1,
          zIndex: 10,
        },
        "& .ProseMirror": {
          outline: "none",
          minHeight: "40px",
          border: "1px solid rgba(0, 0, 0, 0.23)",
          borderRadius: 1,
          px: 1.5,
          py: 1,
          "& > p": editor?.isEmpty
            ? {
                marginBlockStart: 0,
                marginBlockEnd: 0,
              }
            : {},
        },
      }}
    >
      {editor && isEditable && <RichEditorMenuBar editor={editor} />}
      <Box
        component="input"
        sx={{
          zIndex: -1,
          visibility: "hidden",
          width: 0,
          height: 0,
          position: "absolute",
        }}
        ref={inputRef}
      />
      <EditorContent editor={editor} />
    </Box>
  );
};

export default RichEditor;
