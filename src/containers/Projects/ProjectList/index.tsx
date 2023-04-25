import { Avatar, Box, CircularProgress, Divider, Paper, Stack, Typography } from '@mui/material';
import { useQuery } from 'react-query';
import { getAllUserProjects, Project } from '../../../api/project';
import { FC } from 'react';
import routes from '../../../utils/routes';
import Link from '../../../components/Link';
import ReactAvatar from 'react-avatar';
import ProjectCard from '../ProjectCard';



export default function ProjectList() {
  const {
    data: allUserProjects,
    isLoading: isAllUserProjectsLoading,
    isRefetching,
    error,
    isError
  } = useQuery('getAllUserProjects', getAllUserProjects, {});

  if (isError) {
    return <div>Error: {error}</div>;
  }

  if (!allUserProjects || isAllUserProjectsLoading || isRefetching) {
    return <Box p={4} display='flex' justifyContent='center'><CircularProgress /></Box>;
  }


  return (
    <div>
      <Stack mt={4} spacing={2} divider={<Divider />}>
        {allUserProjects.payload.map((project) => (
          <ProjectCard project={project} key={project.id} />
        ))}
      </Stack>
    </div>
  );
}