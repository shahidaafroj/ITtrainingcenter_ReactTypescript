


// import React, { useState } from 'react';
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   Button,
//   Box,
//   Drawer,
//   List,
//   ListItem,
//   ListItemText,
//   Divider,
//   useTheme,
//   useMediaQuery,
//   makeStyles
// } from '@material-ui/core';
// import { NavLink } from 'react-router-dom';

// const useStyles = makeStyles((theme) => ({
//   appBar: {
//     backgroundColor: '#0ab9f2',
//   },
//   navButton: {
//     color: 'white !important',
//     fontWeight: 500,
//     margin: '0 8px',
//     '&:hover': {
//       backgroundColor: 'rgba(255, 255, 255, 0.1)',
//     },
//     '&.active': {
//       backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     },
//   },
//   menuButton: {
//     marginRight: theme.spacing(2),
//     color: 'white',
//     fontWeight: 600,
//   },
//   title: {
//     flexGrow: 1,
//     color: 'white',
//     fontWeight: 600,
//   },
//   drawerPaper: {
//     backgroundColor: '#f5f5f5',
//     width: 250,
//   },
//   drawerItem: {
//     color: theme.palette.primary.main,
//     '&.active': {
//       backgroundColor: '#0ab9f2 !important',
//       '& .MuiListItemText-primary': {
//         color: 'white !important',
//       },
//     },
//   },
// }));

// const Navbar: React.FC = () => {
//   const classes = useStyles();
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

//   const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
//     if (
//       event.type === 'keydown' &&
//       ((event as React.KeyboardEvent).key === 'Tab' ||
//         (event as React.KeyboardEvent).key === 'Shift')
//     ) {
//       return;
//     }
//     setDrawerOpen(open);
//   };

//   return (
//     <>
//       <AppBar position="static" className={classes.appBar}>
//         <Toolbar>
//           {isMobile && (
//             <Button
//               className={classes.menuButton}
//               onClick={toggleDrawer(true)}
//             >
//               MENU
//             </Button>
//           )}
          
//           <Typography variant="h6" className={classes.title}>
//             IT Training Center
//           </Typography>

//           {!isMobile && (
//             <Box display="flex">
//               <Button 
//                 component={NavLink as React.ElementType}
//                 exact
//                 to="/"
//                 className={classes.navButton}
//                 activeClassName="active"
//               >
//                 Home
//               </Button>
//               <Button 
//                 component={NavLink as React.ElementType}
//                 to="/dashboard"
//                 className={classes.navButton}
//                 activeClassName="active"
//               >
//                 Dashboard
//               </Button>
//               <Button 
//                 component={NavLink as React.ElementType}
//                 to="/login"
//                 className={classes.navButton}
//                 activeClassName="active"
//               >
//                 Login
//               </Button>
//               <Button 
//                 component={NavLink as React.ElementType}
//                 to="/register"
//                 className={classes.navButton}
//                 activeClassName="active"
//               >
//                 Register
//               </Button>
//             </Box>
//           )}

//           {isMobile && (
//             <Button 
//               component={NavLink as React.ElementType}
//               to="/login"
//               className={classes.navButton}
//               activeClassName="active"
//             >
//               Login
//             </Button>
//           )}
//         </Toolbar>
//       </AppBar>

//       {/* Mobile Drawer */}
//       <Drawer 
//         anchor="left" 
//         open={drawerOpen} 
//         onClose={toggleDrawer(false)}
//         classes={{ paper: classes.drawerPaper }}
//       >
//         <Box
//           width={250}
//           role="presentation"
//           onClick={toggleDrawer(false)}
//           onKeyDown={toggleDrawer(false)}
//         >
//           <List>
//             <ListItem 
//               button 
//               component={NavLink as React.ElementType}
//               exact
//               to="/"
//               className={classes.drawerItem}
//               activeClassName="active"
//             >
//               <ListItemText primary="Home" />
//             </ListItem>

//             <Divider />

//             <ListItem 
//               button 
//               component={NavLink as React.ElementType}
//               to="/dashboard"
//               className={classes.drawerItem}
//               activeClassName="active"
//             >
//               <ListItemText primary="Dashboard" />
//             </ListItem>

//             <Divider />

//             <ListItem 
//               button 
//               component={NavLink as React.ElementType}
//               to="/login"
//               className={classes.drawerItem}
//               activeClassName="active"
//             >
//               <ListItemText primary="Login" />
//             </ListItem>

//             <ListItem 
//               button 
//               component={NavLink as React.ElementType}
//               to="/register"
//               className={classes.drawerItem}
//               activeClassName="active"
//             >
//               <ListItemText primary="Register" />
//             </ListItem>
//           </List>
//         </Box>
//       </Drawer>
//     </>
//   );
// };

// export default Navbar;

// // export default Navbar;
// import React, { useState } from 'react';
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   Button,
//   Box,
//   Drawer,
//   List,
//   ListItem,
//   ListItemText,
//   Divider,
//   useTheme,
//   useMediaQuery,
//   makeStyles,
//   Avatar,
//   Menu,
//   MenuItem,
//   ListItemIcon
// } from '@material-ui/core';
// import { NavLink, useNavigate } from 'react-router-dom';
// import { ExitToApp, AccountCircle } from '@material-ui/icons';
// import { useAuth } from '../context/AuthContext';

// const useStyles = makeStyles((theme) => ({
//   appBar: {
//     backgroundColor: '#0ab9f2',
//   },
//   navButton: {
//     color: 'white !important',
//     fontWeight: 500,
//     margin: '0 8px',
//     '&:hover': {
//       backgroundColor: 'rgba(255, 255, 255, 0.1)',
//     },
//     '&.active': {
//       backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     },
//   },
//   menuButton: {
//     marginRight: theme.spacing(2),
//     color: 'white',
//     fontWeight: 600,
//   },
//   title: {
//     flexGrow: 1,
//     color: 'white',
//     fontWeight: 600,
//   },
//   drawerPaper: {
//     backgroundColor: '#f5f5f5',
//     width: 250,
//   },
//   drawerItem: {
//     color: theme.palette.primary.main,
//     '&.active': {
//       backgroundColor: '#0ab9f2 !important',
//       '& .MuiListItemText-primary': {
//         color: 'white !important',
//       },
//     },
//   },
//   userMenu: {
//     marginLeft: theme.spacing(2),
//   },
//   userButton: {
//     color: 'white',
//     textTransform: 'none',
//   },
// }));

// const Navbar: React.FC = () => {
//   const classes = useStyles();
//   const { isAuthenticated, username, logout } = useAuth();
//   const navigate = useNavigate();
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [userAnchorEl, setUserAnchorEl] = useState<null | HTMLElement>(null);
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

//   const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
//     if (
//       event.type === 'keydown' &&
//       ((event as React.KeyboardEvent).key === 'Tab' ||
//         (event as React.KeyboardEvent).key === 'Shift')
//     ) {
//       return;
//     }
//     setDrawerOpen(open);
//   };

//   const handleLogout = () => {
//     logout();
//     setUserAnchorEl(null);
//     navigate('/');
//   };

//   const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => setUserAnchorEl(event.currentTarget);
//   const handleUserMenuClose = () => setUserAnchorEl(null);

//   return (
//     <>
//       <AppBar position="static" className={classes.appBar}>
//         <Toolbar>
//           {isMobile && (
//             <Button className={classes.menuButton} onClick={toggleDrawer(true)}>
//               MENU
//             </Button>
//           )}
          
//           <Typography variant="h6" className={classes.title}>
//             IT Training Center
//           </Typography>

//           {!isAuthenticated ? (
//             !isMobile ? (
//               <Box display="flex">
//                 <Button component={NavLink} to="/" className={classes.navButton}>
//                   Home
//                 </Button>
//                 <Button component={NavLink} to="/login" className={classes.navButton}>
//                   Login
//                 </Button>
//                 <Button component={NavLink} to="/register" className={classes.navButton}>
//                   Register
//                 </Button>
//               </Box>
//             ) : (
//               <>
//                 <Button component={NavLink} to="/login" className={classes.navButton}>
//                   Login
//                 </Button>
//                 <Button component={NavLink} to="/register" className={classes.navButton}>
//                   Register
//                 </Button>
//               </>
//             )
//           ) : (
//             <Box display="flex" alignItems="center">
//               <Button component={NavLink} to="/dashboard" className={classes.navButton}>
//                 Dashboard
//               </Button>
//               <Button
//                 className={classes.userButton}
//                 startIcon={<AccountCircle />}
//                 onClick={handleUserMenuOpen}
//               >
//                 {username}
//               </Button>
//               <Menu
//                 anchorEl={userAnchorEl}
//                 keepMounted
//                 open={Boolean(userAnchorEl)}
//                 onClose={handleUserMenuClose}
//                 className={classes.userMenu}
//               >
//                 <MenuItem onClick={handleUserMenuClose}>Profile</MenuItem>
//                 <MenuItem onClick={handleUserMenuClose}>Settings</MenuItem>
//                 <MenuItem onClick={handleLogout}>
//                   <ListItemIcon>
//                     <ExitToApp fontSize="small" />
//                   </ListItemIcon>
//                   <ListItemText primary="Logout" />
//                 </MenuItem>
//               </Menu>
//             </Box>
//           )}
//         </Toolbar>
//       </AppBar>

//       {/* Mobile Drawer */}
//       <Drawer 
//         anchor="left" 
//         open={drawerOpen} 
//         onClose={toggleDrawer(false)}
//         classes={{ paper: classes.drawerPaper }}
//       >
//         <Box width={250} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
//           <List>
//             <ListItem button component={NavLink} to="/" className={classes.drawerItem}>
//               <ListItemText primary="Home" />
//             </ListItem>
//             <Divider />
            
//             {isAuthenticated && (
//               <>
//                 <ListItem button component={NavLink} to="/dashboard" className={classes.drawerItem}>
//                   <ListItemText primary="Dashboard" />
//                 </ListItem>
//                 <Divider />
//                 <ListItem button className={classes.drawerItem}>
//                   <ListItemText primary="Profile" />
//                 </ListItem>
//                 <ListItem button onClick={handleLogout} className={classes.drawerItem}>
//                   <ListItemIcon><ExitToApp /></ListItemIcon>
//                   <ListItemText primary="Logout" />
//                 </ListItem>
//               </>
//             )}

//             {!isAuthenticated && (
//               <>
//                 <ListItem button component={NavLink} to="/login" className={classes.drawerItem}>
//                   <ListItemText primary="Login" />
//                 </ListItem>
//                 <ListItem button component={NavLink} to="/register" className={classes.drawerItem}>
//                   <ListItemText primary="Register" />
//                 </ListItem>
//               </>
//             )}
//           </List>
//         </Box>
//       </Drawer>
//     </>
//   );
// };

// export default Navbar;


// export default Navbar;
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
  makeStyles,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon
} from '@material-ui/core';
import { NavLink, useNavigate } from 'react-router-dom';
import { ExitToApp, AccountCircle, Home, Dashboard } from '@material-ui/icons';
import { useAuth } from '../context/AuthContext';

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: '#0ab9f2',
  },
  navButton: {
    color: 'white !important',
    fontWeight: 500,
    margin: '0 8px',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    '&.active': {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    color: 'white',
    fontWeight: 600,
  },
  title: {
    flexGrow: 1,
    color: 'white',
    fontWeight: 600,
  },
  drawerPaper: {
    backgroundColor: '#f5f5f5',
    width: 250,
  },
  drawerItem: {
    color: theme.palette.primary.main,
    '&.active': {
      backgroundColor: '#0ab9f2 !important',
      '& .MuiListItemText-primary': {
        color: 'white !important',
      },
    },
  },
  userMenu: {
    marginLeft: theme.spacing(2),
  },
  userButton: {
    color: 'white',
    textTransform: 'none',
  },
}));

const Navbar: React.FC = () => {
  const classes = useStyles();
  const { isAuthenticated, username, logout } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userAnchorEl, setUserAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleLogout = () => {
    logout();
    setUserAnchorEl(null);
    navigate('/');
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => setUserAnchorEl(event.currentTarget);
  const handleUserMenuClose = () => setUserAnchorEl(null);

  return (
    <>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          {isMobile && (
            <Button className={classes.menuButton} onClick={toggleDrawer(true)}>
              MENU
            </Button>
          )}
          
          <Typography variant="h6" className={classes.title}>
            IT Training Center
          </Typography>

          {!isAuthenticated ? (
            !isMobile ? (
              <Box display="flex">
                <Button component={NavLink} to="/" className={classes.navButton}>
                  Home
                </Button>
                <Button component={NavLink} to="/login" className={classes.navButton}>
                  Login
                </Button>
                <Button component={NavLink} to="/register" className={classes.navButton}>
                  Register
                </Button>
              </Box>
            ) : (
              <>
                <Button component={NavLink} to="/login" className={classes.navButton}>
                  Login
                </Button>
                <Button component={NavLink} to="/register" className={classes.navButton}>
                  Register
                </Button>
              </>
            )
          ) : (
            <Box display="flex" alignItems="center">
              <Button component={NavLink} to="/dashboard" className={classes.navButton}>
                Dashboard
              </Button>
              <Button
                className={classes.userButton}
                startIcon={<AccountCircle />}
                onClick={handleUserMenuOpen}
              >
                {username}
              </Button>
              <Menu
                anchorEl={userAnchorEl}
                keepMounted
                open={Boolean(userAnchorEl)}
                onClose={handleUserMenuClose}
                className={classes.userMenu}
              >
                <MenuItem onClick={handleUserMenuClose}>
                  <ListItemIcon>
                    <AccountCircle fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Welcome to TSP" />
                </MenuItem>
                <MenuItem component={NavLink} to="/dashboard" onClick={handleUserMenuClose}>
                  <ListItemIcon>
                    <Dashboard fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </MenuItem>
                <MenuItem component={NavLink} to="/" onClick={handleUserMenuClose}>
                  <ListItemIcon>
                    <Home fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Back To Home" />
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <ExitToApp fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer 
        anchor="left" 
        open={drawerOpen} 
        onClose={toggleDrawer(false)}
        classes={{ paper: classes.drawerPaper }}
      >
        <Box width={250} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
          <List>
            <ListItem button component={NavLink} to="/" className={classes.drawerItem}>
              <ListItemIcon><Home /></ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>
            <Divider />
            
            {isAuthenticated && (
              <>
                <ListItem button component={NavLink} to="/dashboard" className={classes.drawerItem}>
                  <ListItemIcon><Dashboard /></ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItem>
                <Divider />
                <ListItem button className={classes.drawerItem}>
                  <ListItemIcon><AccountCircle /></ListItemIcon>
                  <ListItemText primary="Welcome" />
                </ListItem>
                <ListItem button component={NavLink} to="/" className={classes.drawerItem}>
                  <ListItemIcon><Home /></ListItemIcon>
                  <ListItemText primary="Back To Home" />
                </ListItem>
                <ListItem button onClick={handleLogout} className={classes.drawerItem}>
                  <ListItemIcon><ExitToApp /></ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItem>
              </>
            )}

            {!isAuthenticated && (
              <>
                <ListItem button component={NavLink} to="/login" className={classes.drawerItem}>
                  <ListItemText primary="Login" />
                </ListItem>
                <ListItem button component={NavLink} to="/register" className={classes.drawerItem}>
                  <ListItemText primary="Register" />
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;