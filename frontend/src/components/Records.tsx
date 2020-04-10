import { Box, Button, Grid } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import {
  createStyles, Theme, withStyles,
} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import User from '../model/User';
import backend from '../services/backend';
import auth from '../utils/auth';

const styles = (theme: Theme) => createStyles({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  title: {
    flex: '1 1 100%',
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
});

interface RecordsState {
  user: User;
  records: Array<any>;
}

interface RecordsProps extends RouteComponentProps {
  classes: any;
}

class Records extends Component<RecordsProps, RecordsState> {
  constructor(props: RecordsProps) {
    super(props);

    let user;
    if (this.props.location.state) {
      const state = this.props.location.state as any;
      user = state?.user;
    }
    if (!user) {
      user = auth.getUser();
    }

    this.state = {
      user,
      records: [],
    };

    this.fetchRecords = this.fetchRecords.bind(this);

    this.fetchRecords();
  }

  async fetchRecords() {
    let records = await backend.getRecords(this.state.user.id);
    records = records.filter((record) => record.state === 'COMPLETED');
    this.setState({
      ...this.state,
      records,
    });
  }

  handleView(record: any) {
    this.props.history.push({
      pathname: '/review',
      state: { review: record },
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Toolbar>
            <Typography className={classes.title} variant="h6" id="tableTitle">
              {this.state.user.id === auth.getUser().id ? 'Your ' : `${this.state.user.firstName} ${this.state.user.lastName}`}
              {' '}
              Records
            </Typography>
          </Toolbar>
          <TableContainer>
            <Table
              className={classes.table}
              aria-labelledby="tableTitle"
              size="medium"
              aria-label="enhanced table"
            >
              <TableHead>
                <TableRow>
                  <TableCell align="center" padding="default">User Id</TableCell>
                  <TableCell align="center" padding="default">First Name</TableCell>
                  <TableCell align="center" padding="default">Last Name</TableCell>
                  <TableCell align="center" padding="checkbox" />
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.records.length === 0
                                    && (
                                    <TableRow
                                      hover
                                      tabIndex={-1}
                                    >
                                      <TableCell align="center" colSpan={5}>No records available!</TableCell>
                                    </TableRow>
                                    )}
                {this.state.records
                  .map((record, index) => (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={index}
                    >
                      <TableCell component="th" scope="row" align="center">{record.reviewee.id}</TableCell>
                      <TableCell align="center">{record.reviewee.firstName}</TableCell>
                      <TableCell align="center">{record.reviewee.lastName}</TableCell>
                      <TableCell align="center">
                        <Button size="small" variant="contained" color="primary" onClick={() => this.handleView(record)}>View</Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          {this.state.user.id !== auth.getUser().id
                        && (
                        <Box p={2}>
                          <Grid item xs={12} md={12} lg={12}>
                            <Button variant="contained" color="secondary" onClick={() => this.props.history.goBack()}>Back</Button>
                          </Grid>
                        </Box>
                        )}
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(Records);
