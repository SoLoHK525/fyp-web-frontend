import { ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Typography, useTheme } from '@mui/material';
import { DriveFileRenameOutline, Delete } from '@mui/icons-material';

export default function ContextMenu(
  {
    contextMenuAnchor,
    handleContextMenuClose,
    actions,
  }: {
    contextMenuAnchor: null | HTMLElement,
    handleContextMenuClose: () => void,
    actions: {
      name: string,
      icon: JSX.Element,
      shortcut?: string,
      onClick?: () => void,
    }[]
  },
) {
  const theme = useTheme();


  return (
    <Menu
      sx={{
        width: '320px',
        maxWidth: '100%',
        color: theme.palette.vscode.sidebar.foreground,
        '& .MuiMenu-paper': {
          backgroundColor: theme.palette.vscode.sidebar.background,
        },
        '& .MuiMenuItem-root': {
          color: theme.palette.vscode.sidebar.foreground,
        },
        // hover
        '& .MuiMenuItem-root:hover': {
          backgroundColor: theme.palette.vscode.sidebar.hoverBackground,
          color: theme.palette.vscode.sidebar.hoverForeground,
        },

      }}
      onContextMenu={(e) => {
        e.preventDefault();
        handleContextMenuClose();
      }}

      id='basic-menu'
      anchorEl={contextMenuAnchor}
      open={Boolean(contextMenuAnchor)}
      onClose={handleContextMenuClose}
      // hideBackdrop
      MenuListProps={{
        'aria-labelledby': 'basic-button',
        style: {
          width: '320px',
          maxWidth: '100%',
          color: theme.palette.vscode.sidebar.foreground,
        },
      }}
    >
      <MenuList dense>
        {/*<MenuItem>*/}
        {/*  <ListItemIcon>*/}
        {/*      <span style={{ color: theme.palette.vscode.sidebar.foreground }}>*/}
        {/*        <ContentCopy color='inherit' fontSize='small' />*/}
        {/*      </span>*/}
        {/*  </ListItemIcon>*/}
        {/*  <ListItemText>Copy</ListItemText>*/}
        {/*  <Typography variant='body2' color='inherit'>*/}
        {/*    ⌘ C*/}
        {/*  </Typography>*/}
        {/*</MenuItem>*/}

        {
          actions.map((action) => (
            <MenuItem key={action.name} onClick={action.onClick}>
              <ListItemIcon>
                <span style={{ color: theme.palette.vscode.sidebar.foreground }}>
                  {action.icon}
                </span>
              </ListItemIcon>
              <ListItemText>{action.name}</ListItemText>
              <Typography fontWeight="bold" variant='body2'>
                { action.shortcut }
              </Typography>
            </MenuItem>
          ))
        }
      </MenuList>
    </Menu>
  );
}