import blue from '@material-ui/core/colors/blue';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import React from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';

import Login from './components/Login';
import AdminLayout from './layouts/AdminLayout';
import auth from './utils/auth';

const theme = createMuiTheme({
  palette: {
    primary: blue,
  },
});

const NonAuthenticatedRoute = ({ component: Component, ...rest }: any) => (
  <Route
    {...rest}
    render={(props) => (!auth.isLoggedIn() ? <Component {...props} /> : (<Redirect to={{ pathname: '/' }} />))}
  />
);

const AuthenticatedRoute = ({ component: Component, ...rest }: any) => (
  <Route
    {...rest}
    render={(props) => (auth.isLoggedIn() ? <Component {...props} /> : (<Redirect to={{ pathname: '/login' }} />))}
  />
);

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Switch>
          <NonAuthenticatedRoute path="/login" exact component={Login} />
          <AuthenticatedRoute component={AdminLayout} />
        </Switch>
      </Router>
    </ThemeProvider>
  );
}
