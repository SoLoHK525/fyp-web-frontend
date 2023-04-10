import { styled } from '@mui/material/styles';

const VSCodeEditorButton = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.vscode.sidebar.background,
  color: theme.palette.vscode.sidebar.foregroundInactive,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    color: theme.palette.vscode.sidebar.hoverForeground,
  },
}));

export default VSCodeEditorButton;