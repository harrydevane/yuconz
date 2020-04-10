import {
  Box, Button, createStyles, FormControl,
  Grid, InputLabel, MenuItem, Paper, Select, Theme, Typography, withStyles,
} from '@material-ui/core';
import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

import backend from '../services/backend';
import auth from '../utils/auth';

const styles = (theme: Theme) => createStyles({

});

interface ReviewInitiateState {
  user: any;
  reviewer1: any;
  reviewer2: any;
  reviewer2Candidates: Array<any>;
}

interface ReviewInitiateStateProps extends RouteComponentProps {
  classes: any;
}

class ReviewInitiate extends Component<ReviewInitiateStateProps, ReviewInitiateState> {
  constructor(props: ReviewInitiateStateProps) {
    super(props);

    let review;
    if (this.props.location.state) {
      const state = this.props.location.state as any;
      review = state?.review;
    }

    this.state = {
      user: review.user,
      reviewer1: review.reviewer1,
      reviewer2: review.reviewer2Candidates[0],
      reviewer2Candidates: review.reviewer2Candidates,
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

  async handleSubmit() {
    await auth.tryRefresh(true);
    await backend.initiateReview(this.state.user.id, this.state.reviewer1.id, this.state.reviewer2.id);
    this.props.history.push({
      pathname: '/',
      state: { alert: { type: 'success', message: 'Review has been initiated!' } },
    });
  }

  render() {
    return (
      <Grid container>
        <Grid item xs={12} md={12} lg={12}>
          <Paper>
            <Box p={2}>
              <Typography variant="h6" gutterBottom>
                Annual Review for
                {' '}
                {this.state.user.firstName}
                {' '}
                {this.state.user.lastName}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={12} lg={12}>
                  <FormControl disabled>
                    <InputLabel>Reviewer 1</InputLabel>
                    <Select
                      name="reviewer1"
                      labelId="reviewer1"
                      id="reviewer1"
                      value="default"
                    >
                      <MenuItem value="default">{`${this.state.reviewer1.firstName} ${this.state.reviewer1.lastName}`}</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                  <InputLabel>Reviewer 2</InputLabel>
                  <Select
                    name="reviewer2"
                    labelId="reviewer2"
                    id="reviewer2"
                    value={this.state.reviewer2}
                    onChange={this.handleChange}
                  >
                    {this.state.reviewer2Candidates.map((reviewer) => (
                      <MenuItem key={reviewer.id} value={reviewer}>
                        {reviewer.firstName}
                        {' '}
                        {reviewer.lastName}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                  <Button variant="contained" color="primary" onClick={this.handleSubmit}>Initiate Review</Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

export default withRouter(withStyles(styles)(ReviewInitiate));
