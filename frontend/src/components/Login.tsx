import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormHelperText from '@material-ui/core/FormHelperText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import PeopleIcon from '@material-ui/icons/People';
import Alert from '@material-ui/lab/Alert';
import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router';

import AuthenticationRole from '../model/AuthenticationRole';
import auth from '../utils/auth';

interface LoginState {
  id: string;
  password: string;
  role: string;
  error: boolean;
  alert: any;
}

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

const styles = (theme: Theme) => createStyles({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  alert: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  select: {
    marginTop: theme.spacing(1),
  },
});

interface LoginProps extends RouteComponentProps {
  classes: any;
}

class Login extends Component<LoginProps, LoginState> {
  constructor(props: LoginProps) {
    super(props);

    let alert;
    if (this.props.location.state) {
      const state = this.props.location.state as any;
      alert = state?.alert;
    }

    this.state = {
      id: '',
      password: '',
      role: 'EMPLOYEE',
      error: false,
      alert,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event: any) {
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;

    this.setState({
      ...this.state,
      [name]: value,
    });
  }

  async handleSubmit(event: any) {
    event.preventDefault();
    try {
      await auth.login(this.state.id, this.state.password, this.state.role);
      this.props.history.push('/');
      this.setState({
        ...this.state,
        error: false,
        alert: undefined,
      });
    } catch (error) {
      if (error.message && error.message === 'Network Error') {
        this.setState({
          ...this.state,
          error: true,
          alert: { type: 'error', message: error.message },
        });
      } else {
        this.setState({
          ...this.state,
          error: true,
          alert: { type: 'error', message: error.message },
        });
      }
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          {this.state.alert
            && (
            <div className={classes.alert}>
              <Alert variant="filled" severity={this.state.alert.type}>
                {this.state.alert.message}
              </Alert>
            </div>
            )}
          <Avatar className={classes.avatar}>
            <PeopleIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form onSubmit={this.handleSubmit} className={classes.form} noValidate>
            <TextField
              error={this.state.error}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="id"
              label="User ID"
              name="id"
              autoFocus
              onChange={this.handleChange}
            />
            {}
            <TextField
              error={this.state.error}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              onChange={this.handleChange}
            />
            <FormHelperText>Select authentication role</FormHelperText>
            <Select
              className={classes.select}
              error={this.state.error}
              name="role"
              labelId="role"
              id="role"
              fullWidth
              value={this.state.role}
              onChange={this.handleChange}
            >
              {Object.entries(AuthenticationRole).map(([key, val]) => (
                <MenuItem key={key} value={key}>{val}</MenuItem>
              ))}
            </Select>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
          </form>
        </div>
        <Box mt={4}>
          <Copyright />
        </Box>
      </Container>
    );
  }
}

export default withStyles(styles)(Login);
