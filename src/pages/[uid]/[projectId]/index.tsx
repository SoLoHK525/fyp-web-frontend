import { useRouter } from 'next/router';
import { useQuery, useQueryClient } from 'react-query';
import tuple from '../../../utils/tuple';
import { getUserProject } from '../../../api/user';
import { ApiError, request } from '../../../api/_base';
import { Box, Button, CircularProgress, useTheme } from '@mui/material';

import dynamic from 'next/dynamic';

const CodeEditor = dynamic(() => import('../../../components/CodeEditor/CodeEditor'), {
  ssr: false,
});

import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { OnChange } from '@monaco-editor/react';
import { createProjectSession, getProjectExecutor, getProjectFilesResponse } from '../../../api/project';

import TopBar from '../../../containers/Projects/Editor/TopBar';
import VSCodePanelBackground from '../../../components/VSCode/VSCodePanelBackground';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { styled } from '@mui/material/styles';
import FileExplorer from '../../../containers/Projects/Editor/FileExplorer';
import { parse as parseUrl } from 'url';
import Spacer from '../../../components/Spacer';
import { PlayArrow } from '@mui/icons-material';

import { XTerm } from 'xterm-for-react';

const BottomTab = dynamic(() => import('../../../containers/Projects/Editor/BottomTab'), { ssr: false });

const SideBar = dynamic(() => import('../../../containers/Projects/Editor/SideBar'), { ssr: false });


const ProjectPage = () => {
  const router = useRouter();
  const { uid, projectId: pid } = router.query;

  const username = uid as string;
  const projectId = pid as string;

  const queryClient = useQueryClient();

  const [selectedFile, setSelectedFile] = useState<string>('');

  const onFileSelect = (id: string) => {
    setSelectedFile(id);
  };

  const isSSR = typeof window === 'undefined';

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

  const { data: getProjectFiles } = useQuery('getProjectFiles', () => {
    return request<getProjectFilesResponse>(
      'get',
      '/api/file',
      {},
      true,
      {},
      'https://fyp-exector.iamkevin.xyz',
    );
  });

  const onChange: OnChange = useCallback((value, ev) => {
    // console.log(value);
  }, []);

  const loading = getProjectExecutorLoading || getProjectExecutorData?.payload.status === 'pending';

  const project = data?.payload;

  const [sideBarIndex, setSideBarIndex] = useState(0);

  const endpoint = getProjectExecutorData?.payload.endpoint || '';

  const theme = useTheme();

  const terminalRef = useRef<any>(null);

  const file = selectedFile;
  const url = parseUrl(endpoint);

  const isSecure = url.protocol === 'https:';
  const webSocketEndpointUrl = (isSecure ? 'wss' : 'ws') + '://' + url.hostname + ':' + (url.port || isSecure ? 443 : 80);

  const webSocket = useMemo(() => {
    if (isSSR || !endpoint) {
      return;
    }

    return new WebSocket(webSocketEndpointUrl + '/execute');
  }, [endpoint, webSocketEndpointUrl]);

  useEffect(() => {
    if (!endpoint || !webSocket) {
      return;
    }

    webSocket.onopen = () => {
      console.log('Connected to server');
    };

    webSocket.onmessage = (event) => {

      console.log(event.data);
      const payload = JSON.parse(event.data) as {
        event: string;
        data: any;
      };

      // base64 decode to buffer
      const buffer = Buffer.from(payload.data, 'base64');
      const data = buffer.toString('utf-8');

      terminalRef?.current?.terminal?.write(data);
      console.log(terminalRef);
    };

    return () => {
      webSocket.close();
    };
  }, [url.hostname, url.port, url.protocol, file, endpoint, webSocket]);

  const currentFile = getProjectFiles?.payload.files.find((f) => f.id === selectedFile);

  const writeToTerminal = (data: string) => {
    const message = {
      event: 'stdin',
      data: Buffer.from(data).toString('base64'),
    };

    webSocket?.send(JSON.stringify(message));
  };

  const runCode = () => {
    writeToTerminal('\x03\nclear');
    writeToTerminal(`python3 ${currentFile?.name}`);
  };

  if (!project) {
    return <>Loading</>;
  }

  return (
    <Box display='flex' flexDirection='column' width='100vw' height='100vh' overflow='hidden'>
      <TopBar project={project} />
      <Box display='flex' flex={1}>
        <SideBar onChange={setSideBarIndex} value={sideBarIndex} />
        <VSCodePanelBackground sx={{ flexGrow: 1 }}>
          <PanelGroup direction={'horizontal'}>
            {
              sideBarIndex === 0 && (
                <Panel defaultSize={20}>
                  <FileExplorer onFileSelect={onFileSelect} />
                </Panel>
              )
            }
            <VerticalResizeHandle />
            <Panel defaultSize={80}>
              <PanelGroup direction='vertical'>
                <Panel defaultSize={80} minSize={20}>
                  <Box height='100%' width='100%'>
                    <Box height='30px' flex={1} px={2} display='flex' alignItems='center'>
                      <Box>
                      </Box>
                      <Spacer />
                      <Box>
                        {
                          currentFile?.name.endsWith('.py') && (
                            <Button
                              onClick={runCode}
                              style={{ color: 'limegreen' }}>
                              <PlayArrow fontSize='small' color='inherit' />
                            </Button>
                          )
                        }
                      </Box>
                    </Box>
                    {
                      loading || !getProjectExecutorData ? (
                          <ExecutorLoading />
                        ) :
                        (
                          <CodeEditor endpoint={getProjectExecutorData.payload.endpoint} file={selectedFile}
                                      onChange={onChange} />
                        )
                    }
                  </Box>
                </Panel>
                <CustomResizeHandle />
                <Panel defaultSize={20} minSize={20}>
                  <Box mx={1}>
                    {
                      !isSSR && (
                        <BottomTab terminal={
                          () => <XTerm
                            ref={terminalRef}
                            options={{
                              theme: {
                                background: theme.palette.vscode.panel.background,
                              },
                            }}
                            onData={writeToTerminal}
                          />
                        } />
                      )
                    }
                  </Box>
                </Panel>
              </PanelGroup>
            </Panel>
          </PanelGroup>
        </VSCodePanelBackground>
      </Box>
    </Box>
  );
};

const VerticalResizeHandle = styled(PanelResizeHandle)((
  {
    theme,
  },
) => ({
  width: 16,
  zIndex: 10,
  position: 'relative',
  marginLeft: -8,
  '&::before': {
    top: 0,
    left: 8,
    position: 'absolute',
    content: '""',
    display: 'block',
    width: '1px',
    height: '100%',
    backgroundColor: '#333',
    transition: 'background-color 0.2s',
  },
  '&:hover::before': {
    backgroundColor: '#c5c5c5',
  },
  '&:active::before': {
    backgroundColor: '#c5c5c5',
  },
}));

const CustomResizeHandle = styled(PanelResizeHandle)((
  {
    theme,
  },
) => (
  {
    height: 16,
    marginBottom: -8,
    zIndex: 10,
    position: 'relative',
    '&::before': {
      top: 8,
      position: 'absolute',
      content: '""',
      display: 'block',
      width: '100%',
      height: 1,
      backgroundColor: '#333',
      transition: 'background-color 0.2s',
    },
    '&:hover::before': {
      backgroundColor: '#c5c5c5',
    },
    '&:active::before':
      {
        backgroundColor: '#c5c5c5',
      },
  }
));

const ExecutorLoading = () => {
    return (
      <VSCodePanelBackground display='flex' justifyContent='center' alignItems='center' flex={1}>
        <CircularProgress />
      </VSCodePanelBackground>
    );
  }
;

export default ProjectPage;