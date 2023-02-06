import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import tuple from '../../../utils/tuple';
import { getUserProject } from '../../../api/user';
import { ApiError } from '../../../api/_base';
import CodeEditor from '../../../components/CodeEditor';
import { Box } from '@mui/material';

const ProjectPage = () => {
  const router = useRouter();
  const { uid, projectId: pid } = router.query;

  const username = uid as string;
  const projectId = pid as string;

  const { data } = useQuery(tuple(['getUserProject', {
    username,
    projectId,
  }]), () => getUserProject({
    username,
    projectId,
  }), {
    enabled: !!uid && !!projectId,
    onError: ((err: ApiError) => {

    }),
  });

  return (
    <div>
      <h1>Project Page</h1>
      <p>
        {uid} / {projectId}
      </p>
      <div>
        {data?.name}
      </div>
      <Box sx={{ height: '80vh', width: '100%'}}>
        <CodeEditor />
      </Box>
    </div>
  );
};


export default ProjectPage;