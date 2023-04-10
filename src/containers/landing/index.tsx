import Footer from '../../components/Footer';
import { Box, Button, Container, Paper, Stack, Typography } from '@mui/material';
import { useAuthentication } from '../../contexts/AuthenticationContext';
import CustomAppBar from '../AppBar';

const Landing = () => {
  const auth = useAuthentication();

  return (
    <Box minHeight='100vh'>
      <CustomAppBar />
      <Container>
        <Stack height={300} justifyContent='center' spacing={3}>
          <Typography variant='h3-bold'>
            Online Code Practice System
            <button onClick={() => {
              auth.signIn('kevinhk0525@gmail.com', 'password123145');
            }}>Login</button>
          </Typography>
          <Typography variant='body1'>
            The system is under development.
          </Typography>
          <Button variant='text'>xd</Button>
        </Stack>
      </Container>
      <Container>
        <Box py={5}>
          <Typography>Editor Example:</Typography>
          <Box py={2} height={500}>
          </Box>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default Landing;