import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const VSCodePanelBackground = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.vscode.panel.background,
}));

export default VSCodePanelBackground;