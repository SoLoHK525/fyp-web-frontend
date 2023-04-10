import VSCodeSideBarBackground from '../../../../components/VSCode/VSCodeSideBarBackground';
import { Box } from '@mui/material';
import { Project } from '../../../../api/project';
import ReactAvatar from 'react-avatar';
import { useAuthentication } from '../../../../contexts/AuthenticationContext';
import VSCodeEditorButton from '../../../../components/VSCode/VSCodeEditorButton';
import { useRouter } from 'next/router';
import routes from '../../../../utils/routes';
import { ChevronLeft } from '@mui/icons-material';

export default function (
  {
    project
  }: {
    project: Project
  }
) {
  const auth = useAuthentication();
  const router = useRouter();

  const handleBackToProjects = () => {
    router.push(routes.projects);
  }

  return (
    <VSCodeSideBarBackground
      width="100%"
      display="flex"
      height={40}
      justifyContent="space-between"
      alignItems="center"
      fontSize={14}
    >
      <Box ml="58px">
        <VSCodeEditorButton sx={{ fontWeight: 'bold' }} onClick={handleBackToProjects}>
          <ChevronLeft fontSize="small" /> Exit
        </VSCodeEditorButton>
      </Box>
      <Box>
        {project.owner.username}/{project.name}
      </Box>
      <Box px={2}>
        <Box>
          <ReactAvatar name={auth.user?.username} size="24" round />
        </Box>
      </Box>
    </VSCodeSideBarBackground>
  )
}