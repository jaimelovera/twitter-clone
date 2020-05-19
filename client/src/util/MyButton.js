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
  square,
}) => {
  return square ? (
    disabled ? (
      <Button className={btnClassName} disabled>
        {children}
      </Button>
    ) : noTooltip ? (
      <Button onClick={onClick} className={{ btnClassName }}>
        {children}
      </Button>
    ) : (
      <Tooltip title={tip} className={tipClassName} placement="top">
        <Button onClick={onClick} className={btnClassName}>
          {children}
        </Button>
      </Tooltip>
    )
  ) : disabled ? (
    <IconButton className={btnClassName} disabled>
      {children}
    </IconButton>
  ) : noTooltip ? (
    <IconButton onClick={onClick} className={btnClassName}>
      {children}
    </IconButton>
  ) : (
    <Tooltip title={tip} className={tipClassName} placement="top">
      <IconButton onClick={onClick} className={btnClassName}>
        {children}
      </IconButton>
    </Tooltip>
  );
};
