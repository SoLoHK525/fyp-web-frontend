'use client';

/**
 *
 * Link
 *
 */
import React from 'react';

import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import { useRouter } from 'next/router';

import { FCC } from '../../types/react';

export interface LinkProps extends NextLinkProps {
  active?: boolean; // force active state
  target?: HTMLAnchorElement['target'];
}

const Link: FCC<LinkProps> = ({ children, active, target, ...rest }) => {
  const router = useRouter();
  const isActive = active || router.pathname === rest.href;

  if (!children) {
    return <></>;
  }

  const renderChildren = () => {
    // @ts-ignore
    return typeof children === 'function' ? children({ isActive }) : children;
  };

  return (
    <CustomAnchor href={rest.href} className={clsx({ linkActive: isActive })} >
        {renderChildren()}
    </CustomAnchor>
  );
};

const CustomAnchor = styled(NextLink)(({ theme }) => ({
  textDecoration: 'inherit',
  color: 'inherit',
  whiteSpace: 'nowrap',

  '&.linkActive': {
    color: theme.palette.primary.main,
  },

  '&:hover, &:active, &:focus': {
    textDecoration: 'inherit',
    color: 'inherit',

    '&.linkActive': {
      color: theme.palette.primary.light,
    },
  },
}));

export default Link;
