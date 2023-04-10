import { useState } from 'react';
import { Button, IconButton, Menu, MenuItem } from '@mui/material';
import { useAuthentication } from '../../contexts/AuthenticationContext';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from 'react-avatar';

export default function AppBarMenu() {
  const auth = useAuthentication();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent) => {
    // @ts-ignore
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    auth.signOut();
    handleClose();
  };

  return (
    <div>
      <IconButton
        id='basic-button'
        color='inherit'
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <Avatar name={auth.user?.username} size='30' round={true} />
      </IconButton>
      <Menu
        id='basic-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={logout}>Logout</MenuItem>
      </Menu>
    </div>
  );
}