// create app bar

import { Box, AppBar, Container, Button, Typography, Stack } from '@mui/material';
import Spacer from '../../components/Spacer';
import { useAuthentication } from '../../contexts/AuthenticationContext';
import { useRouter } from 'next/router';
import routes from '../../utils/routes';
import Image from 'next/image';
import Link from 'next/link';
import AppBarMenu from './AppBarMenu';
import { styled } from '@mui/material/styles';

export default function CustomAppBar() {
  const auth = useAuthentication();

  const router = useRouter();

  const navigateToLogin = () => {
    // navigate to login page
    router.push(routes.login);
  };

  return (
    <AppBar color='transparent' elevation={0} position='relative'>
      <Container>
        <Box display='flex' height='60px' alignItems='center'>
          <Link href='/'>
            <Box display='flex' alignItems='center'>
              <Image src='/colinker_logo.svg' color='#fff' width={645 / 6} height={140 / 6} alt='logo' />
            </Box>
          </Link>
          <Spacer />

          <Stack direction="row" spacing={4}>
            <CustomLink href={routes.home}>
              Home
            </CustomLink>
            <CustomLink href={routes.forum}>
              Forum
            </CustomLink>
          { auth.isAuthenticated && (
            <CustomLink href={routes.projects}>
              Projects
            </CustomLink>
          )}
          </Stack>
          <Spacer />
          <div style={{ color: 'black' }}>
            {
              auth.isAuthenticated ? (
                <AppBarMenu />
              ) : (
                <Button onClick={navigateToLogin} color='inherit' variant='text'>
                  Sign In
                </Button>
              )
            }
          </div>
        </Box>
      </Container>
    </AppBar>
  );
}

const CustomLink = styled(Link)`
  color: #999999;
  font-weight: bold;
  text-decoration: none;

  &:hover {
    color: #000;
  }

  transition: color 0.2s ease-in-out;

`;