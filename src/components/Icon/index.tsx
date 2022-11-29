/**
 *
 * Icon
 *
 */
import React, { FC, useMemo } from 'react';

import {
  findIconDefinition,
  IconName,
} from '@fortawesome/fontawesome-svg-core';
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome';

export interface IconProps extends FontAwesomeIconProps {
  icon: IconName;
  variant?: 'solid' | 'regular' | 'brand';
}

const Icon: FC<IconProps> = ({ icon, variant = 'solid', ...props }) => {
  const prefix = useMemo(() => {
    switch (variant) {
      case 'regular':
        return 'far';
      case 'brand':
        return 'fab';
      case 'solid':
      default:
        return 'fas';
    }
  }, [variant]);

  const iconDefinition = findIconDefinition({
    iconName: icon,
    prefix,
  });

  return (
    <FontAwesomeIcon
      className="icon"
      fixedWidth
      fontSize="inherit"
      icon={iconDefinition}
      {...props}
    />
  );
};

export type Icons = IconName;

export default Icon;
