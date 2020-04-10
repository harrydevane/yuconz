import {
  Box, Grid, Paper,
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Link, RouteComponentProps } from 'react-router-dom';

interface NotFoundState {

}

type NotFoundProps = RouteComponentProps;

class NotFound extends Component<NotFoundProps, NotFoundState> {
  render() {
    return (
      <Grid container>
        <Grid item md={3} lg={3} />
        <Grid item xs={12} md={6} lg={6}>
          <Paper>
            <Box p={2}>
              <Typography variant="h5" align="center" color="textPrimary" gutterBottom>
                Page Not Found
              </Typography>
              <Typography variant="h6" align="center" color="textSecondary" paragraph>
                Looks like you've followed a broken link or entered a URL that doesn't exist on this site.
              </Typography>
              <Typography align="center">
                <Link to="/">
                  Back to the dashboard
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

export default withRouter(NotFound);
