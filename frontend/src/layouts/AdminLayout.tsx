import {
  AppBar, Box, Container, CssBaseline, Divider, Drawer, IconButton, List,
  ListItem, ListItemIcon, ListItemText, Menu, MenuItem, Toolbar, Typography,
} from '@material-ui/core';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AssignmentLateIcon from '@material-ui/icons/AssignmentLate';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import DashboardIcon from '@material-ui/icons/Dashboard';
import HistoryIcon from '@material-ui/icons/History';
import PeopleIcon from '@material-ui/icons/People';
import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import {
  Route, Switch,
} from 'react-router-dom';

import Dashboard from '../components/Dashboard';
import NotFound from '../components/NotFound';
import Records from '../components/Records';
import ReviewEdit from '../components/ReviewEdit';
import ReviewInitiate from '../components/ReviewInitiate';
import UserEdit from '../components/UserEdit';
import Users from '../components/Users';
import AuthenticationRole from '../model/AuthenticationRole';
import auth from '../utils/auth';

const drawerWidth = 240;

const styles = (theme: Theme) => createStyles({
  root: {
    display: 'flex',
    '& .MuiListItemIcon-root': {
      minWidth: '40px',
    },
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
  review: {
    color: 'red',
  },
});

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      Yuconz
      {' '}
      {new Date().getFullYear()}
      .
    </Typography>
  );
}

interface AdminLayoutState {
  anchor: any;
  open: boolean;
}

interface AdminLayoutProps extends RouteComponentProps {
  classes: any;
}

class AdminLayout extends Component<AdminLayoutProps, AdminLayoutState> {
  constructor(props: AdminLayoutProps) {
    super(props);

    this.state = {
      anchor: undefined,
      open: false,
    };

    this.handleMenu = this.handleMenu.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleMenu(event: any) {
    this.setState({
      ...this.state,
      anchor: event.currentTarget,
      open: true,
    });
  }

  handleClose(path: string) {
    if (path === 'logout') {
      auth.logout();
      this.props.history.push({
        pathname: '/login',
        state: { alert: { type: 'success', message: 'You have been logged out!' } },
      });
      return;
    }
    this.setState({
      ...this.state,
      anchor: undefined,
      open: false,
    });
    this.props.history.push(path);
  }

  render() {
    const { classes } = this.props;
    return (
      <div className="AdminLayout">
        <div className={classes.root}>
          <CssBaseline />
          <AppBar position="absolute" className={classes.appBar}>
            <Toolbar className={classes.toolbar}>
              <div className={classes.title}>
                <Typography variant="h6" color="inherit" noWrap>
                  Yuconz
                </Typography>
                <Typography variant="caption" color="inherit" noWrap>
                  HR Portal
                </Typography>
              </div>
              <MenuItem onClick={this.handleMenu} style={{ padding: '12px' }}>
                <AccountCircleIcon fontSize="large" style={{ marginRight: '14px' }} />
                <div>
                  <Typography style={{ lineHeight: '11px', paddingTop: '4px' }}>
                    {auth.getUser().firstName}
                    {' '}
                    {auth.getUser().lastName}
                  </Typography>
                  <Typography style={{ lineHeight: '11px' }} variant="caption">
                    {AuthenticationRole[auth.getUser().authenticationRole]}
                    {' '}
                    -
                    {auth.getUser().id}
                  </Typography>
                </div>
              </MenuItem>
              <Menu
                id="menu-appbar"
                anchorEl={this.state.anchor}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={this.state.open}
                onClose={this.handleClose}
              >
                <MenuItem onClick={() => this.handleClose('details')}>Personal details</MenuItem>
                <MenuItem onClick={() => this.handleClose('logout')}>Logout</MenuItem>
              </Menu>
            </Toolbar>
          </AppBar>
          <Drawer
            variant="permanent"
            classes={{
              paper: classes.drawerPaper,
            }}
            open
          >
            <div className={classes.toolbarIcon}>
              <IconButton>
                <ChevronLeftIcon />
              </IconButton>
            </div>
            <Divider />
            <List>
              <div>
                <ListItem button onClick={() => this.handleClose('/')}>
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItem>
                <ListItem button onClick={() => this.handleClose('/records')}>
                  <ListItemIcon>
                    <HistoryIcon />
                  </ListItemIcon>
                  <ListItemText primary="Employment Records" />
                </ListItem>
                {(auth.getUser().authenticationRole === 'HR_EMPLOYEE' || auth.getUser().authenticationRole === 'DIRECTOR') && (
                  <ListItem button onClick={() => this.handleClose('/users')}>
                    <ListItemIcon>
                      <PeopleIcon />
                    </ListItemIcon>
                    <ListItemText primary="Manage Users" />
                  </ListItem>
                )}
                {(auth.getUser().review && auth.getUser().review.state === 'INITIATED')
                  && (
                    <ListItem button className={classes.review} onClick={() => this.handleClose('/review')}>
                      <ListItemIcon>
                        <AssignmentLateIcon color="error" />
                      </ListItemIcon>
                      <ListItemText primary="Create Review" />
                    </ListItem>
                  )}
                {(auth.getUser().review && auth.getUser().review.state === 'UNDER_REVIEW')
                  && (
                   <ListItem button className={classes.review} onClick={() => this.handleClose('/review')}>
                      <ListItemIcon>
                        <AssignmentLateIcon color="error" />
                      </ListItemIcon>
                      <ListItemText primary="Update Review" />
                    </ListItem>
                  )}
              </div>
            </List>
          </Drawer>
          <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
              <Switch>
                <Route path="/" exact component={Dashboard} />
                <Route path="/users" exact component={Users} />
                <Route path="/details" exact component={UserEdit} />
                <Route path="/users/new" exact component={UserEdit} />
                <Route path="/records" exact component={Records} />
                <Route path="/review" exact component={ReviewEdit} />
                <Route path="/review/initiate" exact component={ReviewInitiate} />
                <Route path="*" exact component={NotFound} />
              </Switch>
              <Box pt={4}>
                <Copyright />
              </Box>
            </Container>
          </main>
        </div>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(AdminLayout));
