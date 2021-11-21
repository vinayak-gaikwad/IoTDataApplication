import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Collapse from '@mui/material/Collapse';
import ListItemButton from '@mui/material/ListItemButton';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Button from '@mui/material/Button';
import { toast } from 'react-toastify';

import { Link, Switch, Route, Redirect } from 'react-router-dom';
import Login from './Login';
import AddUser from './AddUser';
import Devices from './Devices';
import Sensors from './Sensors';
import AssignDevice from './AssignDevice';
import AssignParent from './AssignParent';
import Data from './Data';
import asyncToast from '../services/asyncToast';
import auth from '../services/auth';
import authToken from '../services/authToken';
import DeviceForm from './DeviceForm';
import SensorForm from './SensorForm';
import Account from './AccountDetails'

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function Dashboard({ user, setUser, history }) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [expandUser, setExpandUser] = React.useState(false);

  const handleClick = () => {
    setExpandUser(!expandUser);
  };
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [route, setRoute] = React.useState('');

  const logout = async () => {
    if (!user) return;
    const toastId = asyncToast.load('Logging out...');
    try {
      await auth.logout();
    } catch (error) {
      console.log(error);
    } finally {
      authToken.removeToken();
      setUser(null);
      asyncToast.update(toastId, 'success', 'Logged out successfully!');
      handleClose();
      history.push('/login');
    }
  };

  const logoutUtil = () => {
    authToken.removeToken();
    setUser(null);
    toast.info('Logged out!');
    history.push('/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            IOT Data Application
          </Typography>
          <Box sx={{ flexGrow: 1 }} />

          {!user && (
            <Button
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              color="inherit"
              component={Link}
              to="/login"
            >
              Login
            </Button>
          )}

          {user && (
            <Typography variant="p" noWrap component="div">
              Hi, {user.name}
            </Typography>
          )}

          {user && (
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          )}
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem component={Link} to='/account' onClick={handleClose}>My account</MenuItem>
            <MenuItem onClick={logout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem
            component={Link}
            to="/"
            button
            key="dashboard"
            selected={route === '/'}
          >
            <ListItemIcon>
              <MailIcon />
            </ListItemIcon>

            <ListItemText primary="Dashboard" />
          </ListItem>

          <ListItem
            component={Link}
            to="/devices"
            button
            key="devices"
            selected={route === '/devices'}
          >
            <ListItemIcon>
              <MailIcon />
            </ListItemIcon>

            <ListItemText primary="Devices" />
          </ListItem>

          <ListItem
            component={Link}
            to="/sensors"
            button
            key="sensors"
            selected={route === '/sensors'}
          >
            <ListItemIcon>
              <MailIcon />
            </ListItemIcon>

            <ListItemText primary="Sensors" />
          </ListItem>

          <ListItemButton
            onClick={handleClick}
            selected={['/adduser', '/assigndevice', '/assignparent'].includes(
              route
            )}
          >
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary="Users" />
            {expandUser ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={expandUser} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                component={Link}
                to="adduser"
                sx={{ pl: 4 }}
                key="adduser"
                selected={route === '/adduser'}
              >
                <ListItemIcon>
                  <MailIcon />
                </ListItemIcon>
                <ListItemText primary="Add New User" />
              </ListItemButton>

              <ListItemButton
                component={Link}
                to="assigndevice"
                sx={{ pl: 4 }}
                key="assigndevice"
                selected={route === '/assigndevice'}
              >
                <ListItemIcon>
                  <MailIcon />
                </ListItemIcon>
                <ListItemText primary="Assign Device" />
              </ListItemButton>

              <ListItemButton
                component={Link}
                to="assignparent"
                sx={{ pl: 4 }}
                key="assignparent"
                selected={route === '/assignparent'}
              >
                <ListItemIcon>
                  <MailIcon />
                </ListItemIcon>
                <ListItemText primary="Assign Parent" />
              </ListItemButton>
            </List>
          </Collapse>
        </List>
        {/* <Divider /> */}
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <Switch>
          <Route path="/login">
            {!user ? (
              <Login setUser={setUser} setRoute={setRoute} />
            ) : (
              <Redirect to="/" />
            )}
          </Route>
          <Route path="/assigndevice">
            <AssignDevice setRoute={setRoute} />
          </Route>
          <Route path="/assignparent">
            <AssignParent setRoute={setRoute} />
          </Route>
          <Route path="/adduser">
            <AddUser user={user} setRoute={setRoute} logout={logoutUtil} />
          </Route>
          <Route path="/devices/:deviceType">
            <DeviceForm user={user} logout={logoutUtil} />
          </Route>
          <Route path="/devices">
            <Devices user={user} setRoute={setRoute} logout={logoutUtil} />
          </Route>
          <Route path="/sensors/:sensorType">
            <SensorForm user={user} setRoute={setRoute} logout={logoutUtil} />
          </Route>
          <Route path="/sensors">
            <Sensors user={user} setRoute={setRoute} logout={logoutUtil} />
          </Route>
          <Route path='/account'>
            <Account user={user}/>
          </Route>
          <Route path="/">
            <Data setRoute={setRoute} />
          </Route>

        </Switch>
      </Main>
    </Box>
  );
}
