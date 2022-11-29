/**
 * Footer
 */
import React, { FC, useMemo } from 'react';

import { IconName } from '@fortawesome/fontawesome-svg-core';
import {
  Box,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import Link from '../Link';
import Icon from '../Icon';

interface LinkTabProps {
  tab: FooterLinkGroup;
}

export interface FooterLinkGroup {
  title: string;
  links: FooterLinks[];
}

interface FooterLinks {
  text: string;
  url: string;
  target: 'self' | 'blank';
}

const LinkTab: FC<LinkTabProps> = ({ tab }) => {
  return (
    <Box>
      <Box mb={2}>
        <Typography variant='h5-bold'>{tab.title}</Typography>
      </Box>
      <Stack spacing={1}>
        {tab.links.map((child, index) => {
          return (
            <FooterLink
              href={child.url}
              key={index}
              target={child.target === 'blank' ? '_blank' : '_self'}
            >
              {child.text}
            </FooterLink>
          );
        })}
      </Stack>
    </Box>
  );
};

export interface FooterSocialMedia {
  type: 'instagram' | 'facebook' | 'twitter' | 'youtube' | 'website';
  link: string;
}

export interface FooterContent {
  slogan: string;
  link_groups: FooterLinkGroup[];
  social_media: FooterSocialMedia[];
}

const Footer: FC = () => {
  const footerContent: FooterContent = {
    slogan: "Practice Makes Perfect",
    social_media: [],
    link_groups: [
      {
        title: 'Application',
        links: [
          {
            text: 'Home',
            url: '/',
            target: 'self',
          }
        ]
      }
    ],
  };

  if (!footerContent) {
    return <></>;
  }

  return (
    <Paper>
      <Container maxWidth="xl">
        <Box px={4} py={8}>
          <Grid container>
            <Grid item lg={4} sm={12}>
              <Box mb={2}>
                <a href="/">
                  Logo
                </a>
              </Box>
              <Box mb={2} width="80%">
                <Typography textTransform="uppercase" variant="h4-bold">
                  {footerContent.slogan}
                </Typography>
              </Box>
              <Box mb={8} ml={-1}>
                {footerContent?.social_media.map((social, index) => {
                  return <SocialMediaLink key={index} social={social} />;
                })}
              </Box>
            </Grid>
            <Grid item lg={8} sm={12}>
              <Grid container justifyContent="space-evenly" mb={8} spacing={8}>
                {footerContent?.link_groups.map((link, index) => {
                  return (
                    <Grid item key={index} md={3} sm={6} xs={12}>
                      <LinkTab tab={link} />
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>
          </Grid>
          <Divider />
          <Box
            display="flex"
            flexWrap="wrap"
            justifyContent="space-between"
            mt={4}
          >
            <Box mb={2}>
              <Typography>Online Code Practice System</Typography>
            </Box>
            <Stack direction="row" spacing={2}>
              <FooterLink href="/privacy-policy">
                Privacy Policy
              </FooterLink>
              <FooterLink href="/terms-condition">
                Terms of Use
              </FooterLink>
            </Stack>
          </Box>
        </Box>
      </Container>
    </Paper>
  );
};

interface SocialMediaLinkProps {
  social: FooterSocialMedia;
}

const SocialMediaLinkWrapper = styled('a')(
  ({ theme }) => `
  color: ${theme.palette.text.secondary};
  font-size: ${theme.typography.pxToRem(32)};
  padding: ${theme.spacing(0.5)};
  
  &:hover {
    color: ${theme.palette.text.primary};
  }
`,
);

const SocialMediaLink: FC<SocialMediaLinkProps> = ({ social }) => {
  const { icon, variant } = useMemo<{
    icon: IconName;
    variant: 'solid' | 'brand';
  }>(() => {
    switch (social.type) {
      case 'website':
        return {
          icon: 'earth-asia',
          variant: 'solid',
        };
      default:
        return {
          icon: social.type,
          variant: 'brand',
        };
    }
  }, [social.type]);

  return (
    <SocialMediaLinkWrapper href={social.link} target="_blank">
      <Icon icon={icon} variant={variant} />
    </SocialMediaLinkWrapper>
  );
};

const FooterLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.primary,
  cursor: 'pointer',
  '&:hover': {
    color: theme.palette.text.secondary,
    textDecoration: 'none',
  },
}));

export default Footer;