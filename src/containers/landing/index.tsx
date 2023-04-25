import Footer from '../../components/Footer';
import { Box, Button, Container, Divider, Paper, Stack, Typography } from '@mui/material';
import { useAuthentication } from '../../contexts/AuthenticationContext';
import CustomAppBar from '../AppBar';
import Image from 'next/image';

const Landing = () => {
  const auth = useAuthentication();

  return (
    <Box minHeight='100vh'>
      <CustomAppBar />
      <Container>
        <Stack height={600} justifyContent='center' mt={8} spacing={3}>
          <Typography textAlign='center' variant='h1-bold' style={{
            background: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 0%, rgba(0,212,255,1) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            The All-in-one <br /> Online Python Practice Platform.
          </Typography>
          <Typography textAlign='center' variant='subtitle2' color="#333">
            Practice your python skills with our interactive editor and test your code with our built-in test runner.
          </Typography>
        </Stack>
        <Box my={8}>
          <Divider />
        </Box>
        <Box p={8} mt={8} display="flex" justifyContent="center" alignItems="center" flexDirection="column">
          <Image src="/showcase.png" alt="showcase" width={1440/2} height={540} />
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default Landing;