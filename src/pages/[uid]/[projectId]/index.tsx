import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import tuple from '../../../utils/tuple';
import { getUserProject } from '../../../api/user';
import { ApiError } from '../../../api/_base';
import { Box } from '@mui/material';
import CodeEditor from '../../../components/CodeEditor';
import { useCallback } from 'react';
import { OnChange } from '@monaco-editor/react';

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

  const onChange: OnChange = useCallback((value, ev) => {
    console.log(value);
  }, []);

  return (
    <div>
      <h1>Project Page</h1>
      <p>
        {uid} / {projectId}
      </p>
      <div>
        {data?.name}
      </div>
      <Box sx={{ height: '80vh', width: '100%' }}>
        {
          <CodeEditor onChange={onChange} />
        }
      </Box>
    </div>
  );
};

export default ProjectPage;