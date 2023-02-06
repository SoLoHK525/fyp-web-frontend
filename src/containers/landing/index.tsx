import Footer from '../../components/Footer';
import { Box, Container, Paper, Stack, Typography } from '@mui/material';
import CodeEditor from '../../components/CodeEditor';
import { useAuthentication } from '../../contexts/AuthenticationContext';

const Landing = () => {
  const auth = useAuthentication();


  return (
    <Box minHeight='100vh'>
      <Paper>
        <Container>
          <Stack spacing={3} justifyContent='center' height={300}>
            <Typography variant='h3-bold'>
              Online Code Practice System
              <button onClick={() => { auth.signIn("kevinhk0525@gmail.com", "password123145")}}>Login</button>
            </Typography>
            <Typography variant="body1">
              The system is under development.
            </Typography>
          </Stack>
        </Container>
      </Paper>
      <Container>
        <Box py={5}>
          <Typography>Editor Example:</Typography>
          <Box py={2} height={500}>
            <CodeEditor />
          </Box>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
}

export default Landing;