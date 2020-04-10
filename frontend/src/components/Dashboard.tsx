import {
  Box, Button, Grid, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

import ReviewState from '../model/ReviewState';
import backend from '../services/backend';
import auth from '../utils/auth';

interface DashboardState {
  uncompletedReviews: Array<any>;
  usersPendingReview: Array<any>;
  alert: any;
}

class Dashboard extends Component<RouteComponentProps, DashboardState> {
  constructor(props: RouteComponentProps) {
    super(props);

    let alert;
    if (this.props.location.state) {
      const state = this.props.location.state as any;
      alert = state?.alert;
    }

    this.state = {
      uncompletedReviews: undefined,
      usersPendingReview: undefined,
      alert,
    };

    if (auth.getUser().authenticationRole === 'HR_EMPLOYEE' || auth.getUser().authenticationRole === 'DIRECTOR') {
      this.fetchReviews();
    }

    this.fetchReviews = this.fetchReviews.bind(this);
  }

  async fetchReviews() {
    const usersPendingReview = await backend.getUsersPendingReview();
    const uncompletedReviews = await backend.getUncompletedReviews();
    this.setState({
      ...this.state,
      usersPendingReview,
      uncompletedReviews,
    });
  }

  handleInitiateReview(review: any) {
    this.props.history.push({
      pathname: '/review/initiate',
      state: { review },
    });
  }

  handleViewReview(review: any) {
    this.props.history.push({
      pathname: '/review',
      state: { review },
    });
  }

  render() {
    return (
      <Grid container spacing={2}>
        {this.state.alert && (
          <Grid item xs={12} md={12} lg={12}>
            <Alert severity={this.state.alert.type}>{this.state.alert.message}</Alert>
          </Grid>
        )}
        <Grid item xs={12} md={12} lg={12}>
          <Paper>
            <Box p={2}>
              <Typography variant="h4" align="center" color="textPrimary" gutterBottom>
                Welcome to Yuconz!
              </Typography>
              <Typography variant="h6" align="center" color="textSecondary" paragraph>
                Yuconz is a HR system that allows easy management of employee records.
              </Typography>
            </Box>
          </Paper>
        </Grid>
        {auth.getUser().authenticationRole === 'HR_EMPLOYEE' && this.state.usersPendingReview && this.state.usersPendingReview.length > 0 && (
          <Grid item xs={6} md={6} lg={6}>
            <Paper>
              <Box p={2}>
                <Typography variant="h6">
                  Needs Review Initiated
                </Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center" padding="default">First Name</TableCell>
                      <TableCell align="center" padding="default">Last Name</TableCell>
                      <TableCell align="right" padding="default" />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.usersPendingReview.map((review) => (
                      <TableRow key={review.user.id}>
                        <TableCell align="center">{review.user.firstName}</TableCell>
                        <TableCell align="center">{review.user.lastName}</TableCell>
                        <TableCell align="right">
                          <Button variant="contained" color="primary" onClick={() => this.handleInitiateReview(review)}>Initiate Review</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Paper>
          </Grid>
        )}
        {auth.getUser().reviewingReviews && auth.getUser().reviewingReviews.length > 0 && (
          <Grid item xs={6} md={6} lg={6}>
            <Paper>
              <Box p={2}>
                <Typography variant="h6">
                  Reviewing Reviews
                </Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center" padding="default">First Name</TableCell>
                      <TableCell align="center" padding="default">Last Name</TableCell>
                      <TableCell align="right" padding="default" />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {auth.getUser().reviewingReviews.map((review) => (
                      <TableRow key={review.reviewee.id}>
                        <TableCell align="center">{review.reviewee.firstName}</TableCell>
                        <TableCell align="center">{review.reviewee.lastName}</TableCell>
                        <TableCell align="right">
                          <Button variant="contained" color="primary" onClick={() => this.handleViewReview(review)}>Review</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Paper>
          </Grid>
        )}
        {(auth.getUser().authenticationRole === 'HR_EMPLOYEE' || auth.getUser().authenticationRole === 'DIRECTOR') && this.state.uncompletedReviews && this.state.uncompletedReviews.length > 0 && (
          <Grid item xs={6} md={6} lg={6}>
            <Paper>
              <Box p={2}>
                <Typography variant="h6">
                  All Uncompleted Reviews
                </Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center" padding="default">First Name</TableCell>
                      <TableCell align="center" padding="default">Last Name</TableCell>
                      <TableCell align="center" padding="default">State</TableCell>
                      <TableCell align="right" padding="default" />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.uncompletedReviews.map((review) => (
                      <TableRow key={review.reviewee.id}>
                        <TableCell align="center">{review.reviewee.firstName}</TableCell>
                        <TableCell align="center">{review.reviewee.lastName}</TableCell>
                        <TableCell align="center">{ReviewState[review.state]}</TableCell>
                        <TableCell align="right">
                          <Button variant="contained" color="primary" onClick={() => this.handleViewReview(review)}>View Review</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>
    );
  }
}

export default withRouter(Dashboard);
