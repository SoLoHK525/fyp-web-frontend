import { useRouter } from 'next/router';
import { useQuery, useQueryClient } from 'react-query';
import tuple from '../../../utils/tuple';
import { getUserProject } from '../../../api/user';
import { ApiError } from '../../../api/_base';
import { Box, CircularProgress } from '@mui/material';

import dynamic from 'next/dynamic';

const CodeEditor = dynamic(() => import('../../../components/CodeEditor/CodeEditor'), {
  ssr: false,
});

import { useCallback } from 'react';
import { OnChange } from '@monaco-editor/react';
import { createProjectSession, getProjectExecutor } from '../../../api/project';

import TopBar from '../../../containers/Projects/Editor/TopBar';
import VSCodePanelBackground from '../../../components/VSCode/VSCodePanelBackground';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { styled } from '@mui/material/styles';

const BottomTab = dynamic(() => import('../../../containers/Projects/Editor/BottomTab'), { ssr: false });

const SideBar = dynamic(() => import('../../../containers/Projects/Editor/SideBar'), { ssr: false });


const ProjectPage = () => {
  const router = useRouter();
  const { uid, projectId: pid } = router.query;

  const username = uid as string;
  const projectId = pid as string;

  const queryClient = useQueryClient();

  const { data, isSuccess } = useQuery(tuple(['getUserProject', {
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

  const {
    data: createProjectSessionData,
    isLoading: createProjectSessionLoading,
    isSuccess: createProjectSessionSuccess,
  } = useQuery(tuple(['createProjectSession', {
    username,
    projectId,
  }]), () => createProjectSession(username, projectId), {
    enabled: !!uid && !!projectId && isSuccess,
  });


  const { data: getProjectExecutorData, isLoading: getProjectExecutorLoading } = useQuery(tuple(['getProjectExecutor', {
    username,
    projectId,
  }]), () => getProjectExecutor(
    username,
    projectId,
  ), {
    enabled: !!uid && !!projectId && !!createProjectSessionData?.payload.token,
    onSuccess: (data) => {
      if (data.payload.status === 'pending') {
        setTimeout(async () => {
          await queryClient.invalidateQueries(tuple(['getProjectExecutor', {
            username,
            projectId,
          }]));
        }, 1000);
      }
    },
    refetchOnMount: true,
  });

  const onChange: OnChange = useCallback((value, ev) => {
    console.log(value);
  }, []);

  const loading = getProjectExecutorLoading || getProjectExecutorData?.payload.status === 'pending';

  const project = data?.payload;

  if (!project) {
    return <>Loading</>;
  }

  return (
    <Box display='flex' flexDirection='column' width='100vw' height='100vh' overflow='hidden'>
      <TopBar project={project} />
      <Box display='flex' flex={1}>
        <SideBar />
        <VSCodePanelBackground sx={{ flexGrow: 1 }}>
          <PanelGroup direction='vertical'>
            <Panel defaultSize={80} minSize={20}>
            {
              loading || !getProjectExecutorData ? (
                  <ExecutorLoading />
                ) :
                (
                  <CodeEditor endpoint={getProjectExecutorData.payload.endpoint} onChange={onChange} />
                )
            }
            </Panel>
            <CustomResizeHandle />
            <Panel defaultSize={20} minSize={20}>
              <Box mx={1}>
                <BottomTab />
              </Box>
            </Panel>
          </PanelGroup>
        </VSCodePanelBackground>
      </Box>
    </Box>
  );
};

const CustomResizeHandle = styled(PanelResizeHandle)(({ theme }) => ({
  height: 16,
  marginBottom: -8,
  zIndex: 10,
  position: "relative",
//  seudoelement
  '&::before': {
    top: 8,
    position: "absolute",
    content: '""',
    display: 'block',
    width: '100%',
    height: 1,
    backgroundColor: "#333",
    transition: 'background-color 0.2s',
  },
  '&:hover::before': {
    backgroundColor: "#c5c5c5",
  },
  '&:active::before': {
    backgroundColor: "#c5c5c5",
  }
}));

const ExecutorLoading = () => {
  return (
    <VSCodePanelBackground display='flex' justifyContent='center' alignItems='center' flex={1}>
      <CircularProgress />
    </VSCodePanelBackground>
  );
};

export default ProjectPage;