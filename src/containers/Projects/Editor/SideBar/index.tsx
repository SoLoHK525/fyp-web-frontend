import VSCodeSideBarBackground from '../../../../components/VSCode/VSCodeSideBarBackground';
import { styled } from '@mui/material/styles';
import { FileCopy, InsertDriveFile } from '@mui/icons-material';
import Spacer from '../../../../components/Spacer';
import VSCodeEditorButton from '../../../../components/VSCode/VSCodeEditorButton';
import clsx from 'clsx';
import { useCallback } from 'react';

export interface SideBarProps {
  onChange: (index: number) => void;
  value: number;
}

export default function(
  {
    onChange,
    value,
  }: SideBarProps,
) {
  const actions = [
    {
      name: 'File',
      icon: <InsertDriveFile />,
    },
  ];

  const onSideBarChange = useCallback((index: number) => {
    if (value === index) {
      onChange(-1);
    } else {
      onChange(index);
    }
  }, [onChange, value]);

  return (
    <VSCodeSideBarBackground sx={{
      width: 58,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {actions.map((action, index) => (
        <SideBarButton
          className={clsx({
            active: index === value,
          })}
          key={index}
          onClick={() => {
            onSideBarChange(index);
          }}>
          {action.icon}
        </SideBarButton>
      ))}
      <Spacer />
      <SideBarButton>
        <FileCopy />
      </SideBarButton>
    </VSCodeSideBarBackground>
  );
}

const SideBarButton = styled(VSCodeEditorButton)(({ theme }) => ({
  width: 58,
  height: 58,
  '&.active': {
    backgroundColor: theme.palette.vscode.sidebar.hoverBackground,
  },
}));