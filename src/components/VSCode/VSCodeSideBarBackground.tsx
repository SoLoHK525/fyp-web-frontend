import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const VSCodeSideBarBackground = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.vscode.sidebar.background,
  color: theme.palette.vscode.sidebar.foreground,
}));

export default VSCodeSideBarBackground;