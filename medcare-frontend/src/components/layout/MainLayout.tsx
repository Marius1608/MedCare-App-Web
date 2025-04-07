import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LogoutIcon from '@mui/icons-material/Logout';
import Avatar from '@mui/material/Avatar';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Badge from '@mui/material/Badge';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import { Button } from '@mui/material';
const drawerWidth = 260;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
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
  backgroundColor: theme.palette.background.default,
  minHeight: '100vh',
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const Logo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2),
  '& svg': {
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main,
  },
}));

const StyledListItem = styled(ListItem)<{ selected?: boolean }>(({ theme, selected }) => ({
  margin: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: selected ? theme.palette.primary.light + '20' : 'transparent',
  '&:hover': {
    backgroundColor: selected ? theme.palette.primary.light + '30' : theme.palette.action.hover,
  },
}));

const MainLayout: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminMenuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { text: 'Users', icon: <PeopleIcon />, path: '/admin/users' },
    { text: 'Doctors', icon: <LocalHospitalIcon />, path: '/admin/doctors' },
    { text: 'Services', icon: <MedicalServicesIcon />, path: '/admin/services' },
    { text: 'Reports', icon: <AssessmentIcon />, path: '/admin/reports' },
  ];

  const receptionistMenuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/receptionist/dashboard' },
    { text: 'Appointments', icon: <CalendarMonthIcon />, path: '/receptionist/appointments' },
  ];

  const menuItems = isAdmin ? adminMenuItems : receptionistMenuItems;

  // Check if a menu item is active
  const isMenuActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
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
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            MedCare System
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ mr: 2 }}>
              {user?.name}
            </Typography>
            <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 40, height: 40 }}>
              {user?.name?.charAt(0) || 'U'}
            </Avatar>
          </Box>
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
          <Logo>
            <HealthAndSafetyIcon sx={{ fontSize: 28 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
              MedCare
            </Typography>
          </Logo>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>
        <Divider />

        <Box sx={{ p: 2 }}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  bgcolor: user?.role === 'ADMIN' ? theme.palette.error.main : theme.palette.success.main,
                  borderRadius: '50%',
                  border: `2px solid ${theme.palette.background.paper}`,
                }}
              />
            }
          >
            <Avatar sx={{ width: 56, height: 56, bgcolor: theme.palette.primary.main, mb: 1 }}>
              {user?.name?.charAt(0) || 'U'}
            </Avatar>
          </Badge>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {user?.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.role}
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        <List component="nav" sx={{ px: 1 }}>
          {menuItems.map((item) => (
            <StyledListItem key={item.text} disablePadding selected={isMenuActive(item.path)}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{ borderRadius: 'inherit' }}
              >
                <ListItemIcon sx={{ color: isMenuActive(item.path) ? theme.palette.primary.main : 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isMenuActive(item.path) ? 600 : 'normal',
                    color: isMenuActive(item.path) ? theme.palette.primary.main : 'inherit',
                  }}
                />
              </ListItemButton>
            </StyledListItem>
          ))}
        </List>

        <Box sx={{ flexGrow: 1 }} />
        <Divider />
        
        <Box sx={{ p: 2 }}>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{ borderRadius: theme.shape.borderRadius }}
          >
            Logout
          </Button>
        </Box>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <Outlet />
      </Main>
    </Box>
  );
};

export default MainLayout;