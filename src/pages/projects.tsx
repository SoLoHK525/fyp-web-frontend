import CustomAppBar from '../containers/AppBar';
import { Box, Button, Container, Divider, IconButton, Stack, Typography } from '@mui/material';
import Footer from '../components/Footer';
import ProjectList from '../containers/Projects/ProjectList';
import Spacer from '../components/Spacer';
import { Refresh } from '@mui/icons-material';
import { useQueryClient } from 'react-query';
import ProtectedContent from '../containers/Auth/ProtectedContent';

export default function Projects() {
  const queryClient = useQueryClient();

  const refreshProjects = () => {
    queryClient.invalidateQueries('getAllUserProjects');
  };

  return <ProtectedContent>
    <CustomAppBar />
    <Box minHeight='50vh'>
      <Container>
        <Box display='flex' alignItems='center'>
          <h1>Projects</h1>
          <Spacer />
          <Stack direction='row' spacing={2} color='black'>
            <Button variant='outlined' color='inherit' onClick={refreshProjects}><Refresh /></Button>
            <Button variant='outlined' color='inherit'>Create Project</Button>
          </Stack>
        </Box>
        <Divider />
        <Box mt={4}>
          <Typography variant='subtitle2'>Projects</Typography>
        </Box>
        <ProjectList />
      </Container>
    </Box>
    <Footer />
  </ProtectedContent>;
}