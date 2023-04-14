import { VSCodePanels, VSCodePanelTab, VSCodePanelView } from '@vscode/webview-ui-toolkit/react';

import VSCodePanelBackground from '../../../../components/VSCode/VSCodePanelBackground';
import { XTerm } from 'xterm-for-react';
import { useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { forwardRef, useEffect, useRef } from 'react';

const Tab = (
  {
    terminal: Terminal
  }: {
    terminal: () => JSX.Element;
  }
) => {
  const theme = useTheme();

  return (
    <VSCodePanelBackground>
      <VSCodePanels>
        <VSCodePanelTab id='tab-terminal'>
          <VSCodeTabText>TERMINAL</VSCodeTabText>
        </VSCodePanelTab>
        <VSCodePanelTab id='tab-logs'>
          <VSCodeTabText>LOGS</VSCodeTabText>
        </VSCodePanelTab>
        <VSCodePanelView id='view-terminal'>
          <Terminal />
        </VSCodePanelView>
        <VSCodePanelView id='view-logs'>
          Logs
        </VSCodePanelView>
      </VSCodePanels>
    </VSCodePanelBackground>
  );
}

export default Tab;

export const VSCodeTabText = styled('div')(({ theme }) => ({
  fontWeight: 'bold',
  textTransform: 'uppercase',
}));