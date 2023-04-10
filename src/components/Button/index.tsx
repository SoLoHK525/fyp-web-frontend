/**
 * Button
 */

import React, { CSSProperties, FC } from 'react';

import ButtonUnstyled, {
  buttonUnstyledClasses,
  ButtonUnstyledProps,
} from '@mui/base/ButtonUnstyled';
import { SxProps } from '@mui/material';
import { styled } from '@mui/system';

import { ButtonColor, ButtonColors } from '../../styles/theme';

export interface RootButtonProps extends Omit<ButtonUnstyledProps, 'color'> {
  color?: ButtonColors | ButtonColor;
  size?: 'x-small' | 'small' | 'medium' | 'large' | 'x-large';
  variant?: 'contained' | 'outlined' | 'text';
  fullWidth?: boolean;
  rounded?: string | boolean;
  weight?: CSSProperties['fontWeight'];
  padding?: string;
  margin?: string;
  sx?: SxProps;
}

const ButtonRoot = styled(ButtonUnstyled)<ButtonProps>(
  ({
    theme,
    padding,
    margin,
    fullWidth = false,
    size = 'medium',
    variant = 'contained',
    disabled = false,
    color = 'orange',
    rounded = 't',
    weight = 'bold',
  }) => {
    const isContained = variant === 'contained';
    const isOutlined = variant === 'outlined';

    const {
      default: baseColor,
      active: baseColorActive,
      hover: baseColorHover,
      text: baseColorText = {
        default: isContained ? 'white' : baseColor,
        active: isContained ? 'white' : baseColorActive,
        hover: isContained ? 'white' : baseColorHover,
        contained: isContained ? 'white' : baseColor,
      },
    } = typeof color === 'string' ? theme.palette.button[color] : color;

    const {
      default: textDefault,
      hover: textHover,
      active: textActive,
      contained: textContained,
    } = baseColorText;

    let fontSize = '1.2rem';

    const { pxToRem } = theme.typography as any;

    const _padding = padding || `${pxToRem(10)} ${pxToRem(18)}`;

    switch (size) {
      case 'x-small':
        fontSize = pxToRem(12);
        break;
      case 'small':
        fontSize = pxToRem(14);
        break;
      case 'medium':
        fontSize = pxToRem(16);
        break;
      case 'large':
        fontSize = pxToRem(18);
        break;
      case 'x-large':
        fontSize = pxToRem(20);
        break;
    }

    return `
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    
    font-weight: ${weight};
    background-color: ${isContained ? baseColor : 'transparent'};
    padding: ${_padding};
    margin: ${margin || 'inherit'};
    border-radius: ${rounded === 't' ? '10px' : '4px'};
    transition: all 150ms ease;
    cursor: pointer;
    box-shadow: ${isOutlined ? `0px 0px 0px 1px ${baseColor} inset;` : 'none'};
    border: none;
    color: ${isContained ? textContained : textDefault};
    height: 100%;
    
    font-size: ${fontSize};
    font-family: Noto Sans TC,Helvetica Neue,Arial,sans-serif;
    
    text-overflow: ellipsis;
    word-break: break-word;
    text-align: center;
    width: ${fullWidth ? '100%' : 'auto'};
  
    &:hover {
      background-color: ${
        !disabled && (!isContained ? `${baseColorHover}1A` : baseColorHover)
      };
      color: ${isContained ? textContained : textHover};
    }
  
    &.${buttonUnstyledClasses.active} {
      background-color: ${
        !isContained ? `${baseColorActive}3A` : baseColorActive
      };
      color: ${isContained ? textContained : textActive};
    }
  
    &.${buttonUnstyledClasses.focusVisible} {
      box-shadow: 0 4px 20px 0 rgba(61, 71, 82, 0.1), 0 0 0 5px rgba(0, 127, 255, 0.5);
      outline: none;
      color: ${isContained ? textContained : textActive};
    }
  
    &.${buttonUnstyledClasses.disabled} {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `;
  },
);

export interface ButtonProps extends RootButtonProps {
  startIcon?: JSX.Element;
  endIcon?: JSX.Element;
}

const ButtonIcon = styled('span')`
  display: inherit;
  vertical-align: middle;

  & > * {
    font-size: inherit;
    height: inherit;
    max-height: inherit;
  }
`;

const ButtonStartIcon = styled(ButtonIcon)(() => ({
  marginRight: 8,
  marginLeft: -8,
}));

const ButtonEndIcon = styled(ButtonIcon)(() => ({
  marginRight: -8,
  marginLeft: 8,
}));

const Button: FC<ButtonProps> = props => {
  const {
    startIcon,
    endIcon,
    fullWidth,
    size,
    variant,
    color,
    rounded,
    sx,
    children,
    weight,
    ...rest
  } = props;

  return (
    <ButtonRoot
      color={color}
      fullWidth={fullWidth}
      rounded={rounded}
      size={size}
      sx={sx}
      variant={variant}
      weight={weight}
      {...rest}
    >
      {startIcon && <ButtonStartIcon>{startIcon}</ButtonStartIcon>}
      {children}
      {endIcon && (
        <ButtonEndIcon style={{ fontSize: 'inherit' }}>{endIcon}</ButtonEndIcon>
      )}
    </ButtonRoot>
  );
};

export default Button;
