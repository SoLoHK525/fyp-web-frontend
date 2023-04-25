import CustomAppBar from '../../containers/AppBar';
import { Box, Button, Container, Divider, IconButton, Stack, Typography } from '@mui/material';
import Footer from '../../components/Footer';
import Spacer from '../../components/Spacer';
import { Refresh } from '@mui/icons-material';
import { useQueryClient } from 'react-query';
import ThreadList from '../../containers/Forum/ThreadList';
import { useAuthentication } from '../../contexts/AuthenticationContext';

export default function Forum() {
  const auth = useAuthentication();
  const queryClient = useQueryClient();

  const refreshThreads = () => {
    queryClient.invalidateQueries('getForumThreads');
  };

  return (
    <>
      <CustomAppBar />
      <Box minHeight='50vh'>
        <Container>
          <Box display='flex' alignItems='center'>
            <h1>Forum</h1>
            <Spacer />
            <Stack direction='row' spacing={2} color='black'>
              <Button variant='outlined' color='inherit' onClick={refreshThreads}><Refresh /></Button>

              {
                auth.isAuthenticated && auth.user?.role === 'teacher' &&
                (
                  <Button variant='outlined' color='inherit'>New Thread</Button>
                )
              }
            </Stack>
          </Box>
          <Divider />
          <Box mt={4}>
            <Typography variant='subtitle2'>Threads</Typography>
          </Box>
          <ThreadList />
        </Container>
      </Box>
      <Footer />
    </>
  );
}