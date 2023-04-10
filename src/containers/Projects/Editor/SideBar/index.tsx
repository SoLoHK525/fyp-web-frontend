import VSCodeSideBarBackground from '../../../../components/VSCode/VSCodeSideBarBackground';
import { styled } from '@mui/material/styles';
import { FileCopy, InsertDriveFile } from '@mui/icons-material';
import Spacer from '../../../../components/Spacer';
import VSCodeEditorButton from '../../../../components/VSCode/VSCodeEditorButton';

export default function() {

  const actions = [
    {
      icon: <InsertDriveFile />,
      onClick: () => {
      },
    },
  ];
  return (
    <VSCodeSideBarBackground sx={{
      width: 58,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {actions.map((action, index) => (
        <SideBarButton key={index} onClick={action.onClick}>
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
}));