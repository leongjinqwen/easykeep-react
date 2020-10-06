import React, { useState } from 'react';
import { toast } from 'react-toastify';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Switch, Route, useHistory } from 'react-router-dom';
import { List, ListItem, ListItemIcon, ListItemText, IconButton, Toolbar, Divider, Typography, AppBar, Drawer } from '@material-ui/core';
import { Menu, ChevronLeft,ChevronRight,PersonAddRounded,ExitToAppRounded,LibraryBooksRounded,AccountBoxRounded,InsertChartRounded,QueueRounded } from '@material-ui/icons';
import Homepage from '../pages/Homepage';
import SignUpPage from '../pages/SignUpPage';
import SignInPage from '../pages/SignInPage';
import ProfilePage from '../pages/ProfilePage';
import AssessmentPage from '../pages/AssessmentPage';
import TransactionPage from '../pages/TransactionPage';
import CreateTransactionPage from '../pages/CreateTransactionPage';
import ReportsPage from '../pages/ReportsPage';
import LedgerPage from '../pages/LedgerPage';
import Dashboard from '../pages/Dashboard';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    backgroundColor: '#324e7b',
    minHeight: '100vh',
    maxWidth: '100vw',
    color:'#f8f8f8',
  },
  appBar: {
    backgroundColor: '#445c84',
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    backgroundColor: '#445c84',
    color: '#f8f8f8',
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

export default function NavBar({currentUser,setCurrentUser}) {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const history = useHistory()

  const handleLogout = () => {
    toast("Logout successfully.")
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setCurrentUser(null)
    history.push("/")
  }

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" noWrap>
            Moment
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem button onClick={()=>history.push(`/dashboard`)}>
            <ListItemIcon>
              <InsertChartRounded />
            </ListItemIcon>
            <ListItemText primary="Analysis" />
          </ListItem>
          <ListItem button onClick={()=>history.push(`/transactions/${localStorage.getItem('assess')}`)}>
            <ListItemIcon>
              <QueueRounded />
            </ListItemIcon>
            <ListItemText primary="Transaction" />
          </ListItem>
          <ListItem button onClick={()=>history.push('/reports')}>
            <ListItemIcon>
              <LibraryBooksRounded />
            </ListItemIcon>
            <ListItemText primary="Report" />
          </ListItem>
          
          <ListItem button onClick={()=>history.push(`/users/${currentUser.id}`)} >
            <ListItemIcon>
              <AccountBoxRounded />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItem>
        </List>
        
        <Divider />

        <List>
          {
            currentUser ? 
            <ListItem button onClick={handleLogout}>
              <ListItemIcon>
                <ExitToAppRounded />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
            :
            <ListItem button onClick={()=>history.push('/signup')}>
              <ListItemIcon>
                <PersonAddRounded />
              </ListItemIcon>
              <ListItemText primary="Sign Up/Sign In" />
            </ListItem>
          }
        </List>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        <Switch>
          <Route path="/" exact>
            <Homepage />
          </Route>
          <Route path="/signup" component={() => <SignUpPage setCurrentUser={setCurrentUser} />} />
          <Route path="/signin" component={() => <SignInPage setCurrentUser={setCurrentUser} />} />
          <Route path="/dashboard" component={() => <Dashboard />} />
          <Route path="/reports" component={() => <ReportsPage />} />
          <Route path="/users/:userid" component={() => <ProfilePage />} />
          <Route path="/assessments/:assessid" component={() => <AssessmentPage />} />
          <Route path="/transactions/new/:assessid" component={() => <CreateTransactionPage />} />
          <Route path="/transactions/:assessid/:accountid" component={() => <LedgerPage />} />
          <Route path="/transactions/:assessid" component={() => <TransactionPage />} />
        </Switch>
      </main>
    </div>
  );
}
