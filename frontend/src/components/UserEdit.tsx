import DateFnsUtils from '@date-io/date-fns';
import {
  Box, Button, Checkbox,
  createStyles, Grid, InputLabel,
  MenuItem, Paper, Select, Theme, withStyles,
} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

import Address from '../model/Address';
import Section from '../model/Section';
import User from '../model/User';
import UserRole from '../model/UserRole';
import backend from '../services/backend';
import auth from '../utils/auth';

const styles = (theme: Theme) => createStyles({

});

interface UserEditState {
  user: User;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: MaterialUiPickersDate;
  line1: string;
  line2: string;
  town: string;
  county: string;
  postcode: string;
  telephoneNumber: string;
  mobileNumber: string;
  emergencyContact: string;
  emergencyContactNumber: string;
  role: string;
  section: string;
  editing: boolean;
  creating: boolean;
  submitted: boolean;
  isSelf: boolean;
  fromUsers: boolean;
  enabled: boolean;
}

interface UserEditProps extends RouteComponentProps {
  classes: any;
}

class UserEdit extends Component<UserEditProps, UserEditState> {
  constructor(props: UserEditProps) {
    super(props);

    let user;
    let fromUsers = false;

    if (this.props.location.state) {
      const state = this.props.location.state as any;
      user = state?.user;
      fromUsers = true;
    } else if (this.props.location.pathname !== '/users/new') {
      user = auth.getUser();
    }

    const address = user?.address;

    this.state = {
      user,
      password: user?.password,
      firstName: user?.firstName,
      lastName: user?.lastName,
      dateOfBirth: user?.dateOfBirth,
      line1: address?.line1,
      line2: address?.line2,
      town: address?.town,
      county: address?.county,
      postcode: address?.postcode,
      telephoneNumber: user?.telephoneNumber,
      mobileNumber: user?.mobileNumber,
      emergencyContact: user?.emergencyContact,
      emergencyContactNumber: user?.emergencyContactNumber,
      role: user?.role,
      section: user?.section,
      enabled: user?.enabled,
      editing: this.props.location.pathname === '/users/new',
      creating: this.props.location.pathname === '/users/new',
      submitted: false,
      isSelf: auth.getUser() === user,
      fromUsers,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleSaveChanges = this.handleSaveChanges.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleBack = this.handleBack.bind(this);
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

  handleDateChange(dateOfBirth: MaterialUiPickersDate) {
    this.setState({ dateOfBirth });
  }

  handleSaveChanges() {
    const authUser = auth.getUser();
    let { user } = this.state;

    if (!this.state.creating && user !== authUser && user.id === authUser.id) {
      user = authUser;
    }

    if ((this.state.creating && !this.state.password) || !this.state.firstName || !this.state.lastName || !this.state.dateOfBirth
      || !this.state.line1 || !this.state.line2 || !this.state.town || !this.state.county
      || !this.state.postcode || !this.state.telephoneNumber || !this.state.mobileNumber
      || !this.state.emergencyContact || !this.state.emergencyContactNumber || !this.state.role || !this.state.section) {
      this.setState({
        ...this.state,
        submitted: true,
      });
      return;
    }

    let address = user?.address;
    if (this.state.creating) {
      address = new Address(
        this.state.line1,
        this.state.line2,
        this.state.town,
        this.state.county,
        this.state.postcode,
      );
      user = new User(undefined,
        this.state.password,
        this.state.firstName,
        this.state.lastName,
        this.state.dateOfBirth,
        address,
        this.state.telephoneNumber,
        this.state.mobileNumber,
        this.state.emergencyContact,
        this.state.emergencyContactNumber,
        this.state.section,
        this.state.role, undefined, undefined, undefined, this.state.enabled);
      backend.createUser(user);
    } else {
      user.firstName = this.state.firstName;
      user.lastName = this.state.lastName;
      user.dateOfBirth = (this.state.dateOfBirth as Date);
      address.line1 = this.state.line1;
      address.line2 = this.state.line2;
      address.town = this.state.town;
      address.county = this.state.county;
      address.postcode = this.state.postcode;
      user.telephoneNumber = this.state.telephoneNumber;
      user.mobileNumber = this.state.mobileNumber;
      user.emergencyContact = this.state.emergencyContact;
      user.emergencyContactNumber = this.state.emergencyContactNumber;
      user.section = this.state.section;
      user.role = this.state.role;
      user.enabled = this.state.enabled;
      backend.updateUser(user);
    }

    this.props.history.push({
      pathname: '/details',
      state: { user },
    });

    this.setState({
      ...this.state,
      user,
      editing: false,
      creating: false,
      submitted: true,
    });
  }

  handleEdit() {
    this.setState({
      ...this.state,
      editing: true,
    });
  }

  handleBack() {
    this.props.history.push('/users');
  }

  render() {
    if (!this.state.editing) {
      return (
        <Grid container spacing={2}>
          <Grid item lg={12} md={12} sm={12}>
            <Paper>
              <Box p={2}>
                <Typography variant="h6" gutterBottom>
                  {!this.state.isSelf || this.state.fromUsers ? `${this.state.user.firstName} ${this.state.user.lastName}'s` : 'Your'}
                  {' '}
                  Personal Details
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Typography><b>User Id</b></Typography>
                    {this.state.user.id}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography><b>First name</b></Typography>
                    {this.state.firstName}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography><b>Last name</b></Typography>
                    {this.state.lastName}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography><b>Date of birth</b></Typography>
                    {this.state.dateOfBirth?.toDateString()}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography><b>Address</b></Typography>
                    {this.state.line1}
                    ,
                    {this.state.line2}
                    <br />
                    {this.state.town}
                    ,
                    {this.state.county}
                    ,
                    {this.state.postcode}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography><b>Telephone number</b></Typography>
                    {this.state.telephoneNumber}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography><b>Mobile number</b></Typography>
                    {this.state.mobileNumber}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography><b>Emergency contact</b></Typography>
                    {this.state.emergencyContact}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography><b>Emergency contact number</b></Typography>
                    {this.state.emergencyContactNumber}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography><b>Role</b></Typography>
                    {UserRole[this.state.role]}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography><b>Section</b></Typography>
                    {Section[this.state.section]}
                  </Grid>
                  {!this.state.isSelf && 
                    <Grid item xs={12} sm={6}>
                      <Typography><b>Enabled</b></Typography>
                      {this.state.enabled ? 'true' : 'false'}
                    </Grid>
                  }
                  <Grid item xs={12} sm={12}>
                    <div style={{ float: 'left' }}>
                      {this.state.fromUsers
                          && <Button variant="contained" color="secondary" onClick={this.handleBack}>Back</Button>}
                    </div>
                    <div style={{ float: 'right' }}>
                      <Button variant="contained" color="primary" onClick={this.handleEdit}>Edit</Button>
                    </div>
                    <div style={{ clear: 'both' }} />
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      );
    }
    return (
      <Grid container spacing={2}>
        <Grid item lg={12} md={12} sm={12}>
          <Paper>
            <Box p={2}>
              <Typography variant="h6" gutterBottom>
                {this.state.creating ? 'Create User'
                  : !this.state.isSelf || this.state.fromUsers
                    ? `${this.state.user.firstName} ${this.state.user.lastName}'s Personal Details` : 'Your Personal Details'}
              </Typography>
              <Grid container spacing={3}>
                {this.state.creating
                  && (
                  <Grid item xs={12} sm={12}>
                    <TextField
                      error={this.state.submitted && !this.state.password}
                      required
                      id="password"
                      name="password"
                      label="Password"
                      fullWidth
                      value={this.state.password}
                      onChange={this.handleChange}
                    />
                  </Grid>
                  )}
                {!this.state.creating &&
                  <Grid item xs={12} sm={6}>
                    <TextField
                      disabled
                      id="id"
                      name="id"
                      label="User Id"
                      fullWidth
                      value={this.state.user.id}
                    />
                  </Grid>
                }
                <Grid item xs={12} sm={6}>
                  <TextField
                    error={this.state.submitted && !this.state.firstName}
                    required
                    id="firstName"
                    name="firstName"
                    label="First name"
                    fullWidth
                    value={this.state.firstName}
                    onChange={this.handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    error={this.state.submitted && !this.state.lastName}
                    required
                    id="lastName"
                    name="lastName"
                    label="Last name"
                    fullWidth
                    value={this.state.lastName}
                    onChange={this.handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      error={this.state.submitted && !this.state.dateOfBirth}
                      disableToolbar
                      variant="inline"
                      format="dd/MM/yyyy"
                      margin="normal"
                      id="date-of-birth"
                      label="Date of birth"
                      value={this.state.dateOfBirth}
                      onChange={this.handleDateChange}
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    error={this.state.submitted && !this.state.line1}
                    required
                    id="line1"
                    name="line1"
                    label="Address line 1"
                    fullWidth
                    value={this.state.line1}
                    onChange={this.handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    error={this.state.submitted && !this.state.line2}
                    id="line2"
                    name="line2"
                    label="Address line 2"
                    fullWidth
                    value={this.state.line2}
                    onChange={this.handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    error={this.state.submitted && !this.state.town}
                    required
                    id="town"
                    name="town"
                    label="Town"
                    fullWidth
                    value={this.state.town}
                    onChange={this.handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    error={this.state.submitted && !this.state.county}
                    required
                    id="county"
                    name="county"
                    label="County"
                    fullWidth
                    value={this.state.county}
                    onChange={this.handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    error={this.state.submitted && !this.state.postcode}
                    required
                    id="postcode"
                    name="postcode"
                    label="Postcode"
                    fullWidth
                    value={this.state.postcode}
                    onChange={this.handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    error={this.state.submitted && !this.state.telephoneNumber}
                    required
                    id="telephoneNumber"
                    name="telephoneNumber"
                    label="Telephone Number"
                    fullWidth
                    value={this.state.telephoneNumber}
                    onChange={this.handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    error={this.state.submitted && !this.state.mobileNumber}
                    required
                    id="mobileNumber"
                    name="mobileNumber"
                    label="Mobile Number"
                    fullWidth
                    value={this.state.mobileNumber}
                    onChange={this.handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    error={this.state.submitted && !this.state.emergencyContact}
                    required
                    id="emergencyContact"
                    name="emergencyContact"
                    label="Emergency Contact"
                    fullWidth
                    value={this.state.emergencyContact}
                    onChange={this.handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    error={this.state.submitted && !this.state.emergencyContactNumber}
                    required
                    id="emergencyContactNumber"
                    name="emergencyContactNumber"
                    label="Emergency Contact Number"
                    fullWidth
                    value={this.state.emergencyContactNumber}
                    onChange={this.handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputLabel id="role-label">Role</InputLabel>
                  <Select
                    error={this.state.submitted && !this.state.role}
                    disabled={auth.getUser().authenticationRole !== 'HR_EMPLOYEE'}
                    required
                    id="role"
                    name="role"
                    label="Role"
                    labelId="role-label"
                    fullWidth
                    value={this.state.role}
                    onChange={this.handleChange}
                  >
                    {Object.entries(UserRole).map(([key, val]) => (
                      <MenuItem key={key} value={key}>{val}</MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputLabel id="section-label">Section</InputLabel>
                  <Select
                    error={this.state.submitted && !this.state.section}
                    disabled={auth.getUser().authenticationRole !== 'HR_EMPLOYEE'}
                    required
                    id="section"
                    name="section"
                    label="Section"
                    labelId="section-label"
                    fullWidth
                    value={this.state.section}
                    onChange={this.handleChange}
                  >
                    {Object.entries(Section).map(([key, val]) => (
                      <MenuItem key={key} value={key}>{val}</MenuItem>
                    ))}
                  </Select>
                </Grid>
                {!this.state.isSelf && !this.state.creating
                  && (
                  <Grid item xs={12} sm={6}>
                    <InputLabel id="enabled-label">Enabled</InputLabel>
                    <Checkbox checked={this.state.enabled} disabled={auth.getUser().authenticationRole !== 'HR_EMPLOYEE'} name="enabled" onClick={this.handleChange} />
                  </Grid>
                  )}
                <Grid item xs={12} sm={12}>
                  <div style={{ float: 'right' }}>
                    <Button variant="contained" color="primary" onClick={this.handleSaveChanges}>{this.state.creating ? 'Create User' : 'Save Changes'}</Button>
                  </div>
                  <div style={{ clear: 'both' }} />
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

export default withRouter(withStyles(styles)(UserEdit));
