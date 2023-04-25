import CustomAppBar from '../AppBar';
import { Box, CircularProgress, Container, Divider, Grid, Stack, Typography } from '@mui/material';
import Footer from '../../components/Footer';
import Image from 'next/image';
import { useAuthentication } from '../../contexts/AuthenticationContext';
import { useQuery } from 'react-query';
import { getAllUserProjects } from '../../api/project';
import ProjectCard from '../Projects/ProjectCard';

export default function Dashboard() {
  const auth = useAuthentication();

  const {
    data: allUserProjects,
    isLoading: isAllUserProjectsLoading,
    isRefetching,
    error,
    isError,
  } = useQuery('getAllUserProjects', getAllUserProjects, {});


  return <>
    <Box minHeight='100vh'>
      <CustomAppBar />
      <Container>
        <Stack height={600} justifyContent='center' mt={8} spacing={3}>
          <Typography textAlign='center' variant='h1-bold' style={{
            background: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 0%, rgba(0,212,255,1) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Welcome back! <br /> {auth.user?.username}
          </Typography>
          <Typography textAlign='center' variant='subtitle2' color='#333'>
            Practice your python skills with our interactive editor and test your code with our built-in test runner.
          </Typography>
        </Stack>
        <Box my={8}>
          <Divider />
        </Box>
        <Box mt={8} flexDirection='column'>
          <Typography variant='h4' fontWeight='bold' mb={4}>
            Your Projects
          </Typography>
          <Grid container>
            {
              allUserProjects?.payload.map((project) => (
                <Grid xs={12} md={4} lg={4} item key={project.id}>
                  <ProjectCard project={project} />
                </Grid>
              ))
            }
          </Grid>
        </Box>
        <Box mb={8}></Box>
      </Container>
      <Footer />
    </Box>
  </>;
}