import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";

export default ({
  children,
  onClick,
  tip,
  btnClassName,
  tipClassName,
  disabled,
  noTooltip,
  style,
  square,
}) => {
  return square ? (
    disabled ? (
      <Button className={btnClassName} style={style} disabled>
        {children}
      </Button>
    ) : noTooltip ? (
      <Button onClick={onClick} style={style} className={btnClassName}>
        {children}
      </Button>
    ) : (
      <Tooltip title={tip} className={tipClassName} placement="top">
        <Button onClick={onClick} style={style} className={btnClassName}>
          {children}
        </Button>
      </Tooltip>
    )
  ) : disabled ? (
    <IconButton className={btnClassName} style={style} disabled>
      {children}
    </IconButton>
  ) : noTooltip ? (
    <IconButton onClick={onClick} style={style} className={btnClassName}>
      {children}
    </IconButton>
  ) : (
    <Tooltip title={tip} className={tipClassName} placement="top">
      <IconButton onClick={onClick} style={style} className={btnClassName}>
        {children}
      </IconButton>
    </Tooltip>
  );
};
