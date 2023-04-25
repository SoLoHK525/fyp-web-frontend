import { FC } from 'react';
import { Project } from '../../../api/project';
import { Box, Typography } from '@mui/material';
import Link from '../../../components/Link';
import routes from '../../../utils/routes';
import ReactAvatar from 'react-avatar';

const ProjectCard: FC<{
  project: Project
}> = ({
        project,
      }) => {
  return (
    <Box display='flex' alignItems='center' p={2}>
      <Box mr={2}>
        <Link href={routes.projectPage(project.owner.username, project.name)}>
          <ReactAvatar name={project.name} size='50' textSizeRatio={1.75} round />
        </Link>
      </Box>
      <Box>
        <Box fontWeight='bold'>
          <Link href={routes.projectPage(project.owner.username, project.name)}>{project.name}</Link>
        </Box>
        <Typography color='gray'>owned by: <Link
          href={routes.userProfile(project.owner.username)}>{project.owner.username}</Link></Typography>
      </Box>
    </Box>
  );
};

export default ProjectCard;