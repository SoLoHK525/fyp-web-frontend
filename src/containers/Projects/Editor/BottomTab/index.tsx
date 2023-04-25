import { VSCodePanels, VSCodePanelTab, VSCodePanelView } from '@vscode/webview-ui-toolkit/react';

import VSCodePanelBackground from '../../../../components/VSCode/VSCodePanelBackground';
import { XTerm } from 'xterm-for-react';
import { useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useEffect, useRef } from 'react';

const Tab = (
  {
    webSocket,
  }: {
    webSocket: WebSocket;
  },
) => {
  return (
    <VSCodePanelBackground>
      <VSCodePanels>
        <VSCodePanelTab id='tab-terminal'>
          <VSCodeTabText>TERMINAL</VSCodeTabText>
        </VSCodePanelTab>
        <VSCodePanelTab id='tab-logs'>
          <VSCodeTabText>LOGS</VSCodeTabText>
        </VSCodePanelTab>
        <VSCodePanelTab id={'tab-run'}>
          <VSCodeTabText>RUN</VSCodeTabText>
        </VSCodePanelTab>
        <VSCodePanelView id='view-terminal'>
          <Terminal webSocket={webSocket} />
        </VSCodePanelView>
        <VSCodePanelView id='view-logs'>
          Logs
        </VSCodePanelView>
        <VSCodePanelView id='view-run'>
          <Runner webSocket={webSocket} />
        </VSCodePanelView>
      </VSCodePanels>
    </VSCodePanelBackground>
  );
};

const Runner = (
  {
    webSocket,
  }: {
    webSocket: WebSocket;
  },
) => {
  const theme = useTheme();
  const terminalRef = useRef<XTerm>(null);

  const onMessageHandler = (event: any) => {
    const payload = JSON.parse(event.data) as {
      event: string;
      data: any;
    };

    if (payload.event != 'run') {
      return;
    }

    // base64 decode to buffer
    const buffer = Buffer.from(payload.data, 'base64');
    const data = buffer.toString('utf-8');

    terminalRef?.current?.terminal?.write(data);
    console.log(terminalRef.current);
  };

  useEffect(() => {
    webSocket.addEventListener('message', onMessageHandler);

    return () => {
      webSocket.removeEventListener('message', onMessageHandler);
    };
  }, [webSocket]);


  const writeToTerminal = (data: string) => {
    // console.log(data);
    const message = {
      event: 'run',
      data: Buffer.from(data).toString('base64'),
    };

    webSocket?.send(JSON.stringify(message));
  };

  return (
    <XTerm
      ref={terminalRef}
      options={{
        theme: {
          background: theme.palette.vscode.panel.background,
        },
      }}
      onData={writeToTerminal}
    />
  );
};

const Terminal = (
  {
    webSocket,
  }: {
    webSocket: WebSocket;
  },
) => {
  const theme = useTheme();
  const terminalRef = useRef<XTerm>(null);

  const onMessageHandler = (event: any) => {
    const payload = JSON.parse(event.data) as {
      event: string;
      data: any;
    };

    if (payload.event != 'terminal') {
      return;
    }

    // base64 decode to buffer
    const buffer = Buffer.from(payload.data, 'base64');
    const data = buffer.toString('utf-8');

    terminalRef?.current?.terminal?.write(data);
  };

  useEffect(() => {
    webSocket.addEventListener('message', onMessageHandler);

    return () => {
      webSocket.removeEventListener('message', onMessageHandler);
    };
  }, [webSocket]);


  const writeToTerminal = (data: string) => {
    // console.log(data, webSocket);
    const message = {
      event: 'stdin',
      data: Buffer.from(data).toString('base64'),
    };

    webSocket?.send(JSON.stringify(message));
  };

  return (
    <XTerm
      ref={terminalRef}
      options={{
        theme: {
          background: theme.palette.vscode.panel.background,
        },
      }}
      onData={writeToTerminal}
    />
  );
};

export default Tab;

export const VSCodeTabText = styled('div')(({ theme }) => ({
  fontWeight: 'bold',
  textTransform: 'uppercase',
}));