import React from 'react'

const usePopover = () => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
        null
      );
    
      const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
      };
    
      const onClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    
    return {anchorEl,handleClick,onClose,open}
}

export default usePopover