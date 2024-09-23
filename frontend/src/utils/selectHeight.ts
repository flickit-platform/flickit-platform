export const SelectHeight = (itemH: number, itemP: number) => {
  return {
    PaperProps: {
      sx: {
        maxHeight: itemH * 4.5 + itemP,
        "&::-webkit-scrollbar": {
          display: "none",
        },
      },
    },
  };
};
