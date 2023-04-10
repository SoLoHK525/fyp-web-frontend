import CustomAppBar from '../containers/AppBar';
import { Box, Button, Container, Divider, Grid, Hidden, Paper, Stack, TextField, Typography } from '@mui/material';
import Image from 'next/image';
import Spacer from '../components/Spacer';
import { useReducer, useState } from 'react';
import { useAuthentication } from '../contexts/AuthenticationContext';
import Link from 'next/link';
import routes from '../utils/routes';

export default function LoginPage() {
  const auth = useAuthentication();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const login = () => {
    // login
    auth.signIn(email, password).then((response) => {
    }).catch((err) => {
      setError(err.message);
    });
  };

  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <>
      <CustomAppBar />
      <Box height='calc(100vh - 60px)' display='flex' justifyContent='center' alignItems='center'>
        <Container maxWidth='md'>
          <Paper>
            <Grid container justifyContent='center'>
              <Hidden mdDown>
                <Grid item lg={6} style={{ overflow: 'hidden' }} m={0} p={0}>
                    <Image src='https://placehold.co/500x600' width='500' height='600' alt='placeholder' />
                </Grid>
              </Hidden>
              <Grid item lg={6} display='flex' flexDirection='column' p={4} alignItems='center' justifyContent='center'>
                <Typography variant='h5' mb={4}>
                  Login
                </Typography>
                <Stack spacing={2} width='100%'>
                  <TextField label='Email' type='email' fullWidth onChange={onEmailChange}></TextField>
                  <TextField label='Password' type='password' fullWidth onChange={onPasswordChange}></TextField>
                  <Button fullWidth onClick={login}>Login</Button>
                  <Typography variant='body2' textAlign='center'>
                    Don't have an account? <Link href={routes.register}>Register</Link>
                  </Typography>
                  <Typography variant='body2' textAlign='center' color='error'>
                    {auth.error?.toString()}
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
    </>
  );
}