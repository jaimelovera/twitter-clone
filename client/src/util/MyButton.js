import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

export default ({
  children,
  onClick,
  tip,
  btnClassName,
  tipClassName,
  disabled,
}) => {
  return !disabled ? (
    <Tooltip title={tip} className={tipClassName} placement="top">
      <IconButton onClick={onClick} className={btnClassName}>
        {children}
      </IconButton>
    </Tooltip>
  ) : (
    <IconButton className={btnClassName} disabled>
      {children}
    </IconButton>
  );
};
