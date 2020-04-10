import {
  Box, Button, Checkbox, createStyles,
  Grid, InputLabel, MenuItem, Paper, Select, Table, TableBody,
  TableCell, TableContainer, TableRow, TextField, Theme, Typography, withStyles,
} from '@material-ui/core';
import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

import Review from '../model/Review';
import Section from '../model/Section';
import UserRole from '../model/UserRole';
import backend from '../services/backend';
import auth from '../utils/auth';
import stringarrayserializer from '../utils/stringarrayserializer';

const recommendations = {
  STAY_IN_POST: 'Stay in post',
  SALARY_INCREASE: 'Salary increase',
  PROMOTION: 'Promotion',
  PROBATION: 'Probation',
  TERMINATION: 'Termination',
};

const styles = (theme: Theme) => createStyles({
  root: {
    '& .MuiTextField-root, & .MuiButton-root': {
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    '& .MuiTextField-root': {
      width: 400,
    },
  },
  listLabel: {
    display: 'inline',
    paddingRight: '8px',
    lineHeight: '50px',
  },
});

interface ReviewEditState {
  review: Review;
  id: number;
  pastPerformance: Array<any>;
  performanceSummary: string;
  futurePerformance: Array<any>;
  reviewerComments: string;
  recommendation: string;
  reviewee: any;
  reviewer1: any;
  reviewer2: any;
  signatures: any;
  state: string;
  hasSigned: boolean;
  isSelf: boolean;
  viewOnly: boolean;
}

interface ReviewEditStateProps extends RouteComponentProps {
  classes: any;
}

class ReviewEdit extends Component<ReviewEditStateProps, ReviewEditState> {
  constructor(props: ReviewEditStateProps) {
    super(props);

    let review;
    let viewOnly;
    if (this.props.location.state) {
      const state = this.props.location.state as any;
      review = state?.review;
      if (review) {
        if (review.signatures.length === 3) {
          viewOnly = true;
        } else if (review.reviewee.id !== auth.getUser().id && review.reviewer1.id !== auth.getUser().id && review.reviewer2.id !== auth.getUser().id) {
          viewOnly = true;
        } else if (review.state !== "UNDER_REVIEW") {
          viewOnly = true;
        }
      }
    }
    if (!review) {
      review = auth.getUser().review;
    }

    this.state = {
      review,
      id: review.id,
      pastPerformance: stringarrayserializer.deserialize(review.pastPerformance),
      performanceSummary: review.performanceSummary,
      futurePerformance: stringarrayserializer.deserialize(review.futurePerformance),
      reviewerComments: review.reviewerComments,
      recommendation: review.recommendation ? review.recommendation : 'STAY_IN_POST',
      reviewee: review.reviewee,
      reviewer1: review.reviewer1,
      reviewer2: review.reviewer2,
      signatures: review.signatures ? review.signatures : [],
      state: review.state,
      hasSigned: review.signatures.some((sig: any) => sig.userId === auth.getUser().id),
      isSelf: review.reviewee.id === auth.getUser().id,
      viewOnly,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSign = this.handleSign.bind(this);
    this.handlePerformanceAdd = this.handlePerformanceAdd.bind(this);
    this.handlePerformanceRemove = this.handlePerformanceRemove.bind(this);
    this.handlePerformanceChange = this.handlePerformanceChange.bind(this);
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

  handlePerformanceAdd(type: string) {
    if (type === 'past') {
      this.state.pastPerformance.push({ key: '', val: '' });
    } else {
      this.state.futurePerformance.push({ key: '', val: '' });
    }
    this.setState({
      ...this.state,
    });
  }

  handlePerformanceRemove(type: string) {
    if (type === 'past') {
      this.state.pastPerformance.pop();
    } else {
      this.state.futurePerformance.pop();
    }
    this.setState({
      ...this.state,
    });
  }

  handlePerformanceChange(event: any, index: number, type: string, key: string) {
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;

    if (type === 'past') {
      this.state.pastPerformance[index][key] = value;
    } else {
      this.state.futurePerformance[index][key] = value;
    }
    this.setState({
      ...this.state,
    });
  }

  async handleSign(event: any) {
    var signatures = this.state.signatures
    if (this.state.signatures.some((sig: any) => sig.userId === auth.getUser().id)) {
      signatures = this.state.signatures.filter((sig: any) => sig.userId !== auth.getUser().id)
    } else {
      this.state.signatures.push({
        userId: auth.getUser().id,
      });
    }
    this.setState({ ...this.state, signatures })
  }

  async handleSubmit() {
    // create new review object
    const review = new Review(
      this.state.id,
      stringarrayserializer.serialize(this.state.pastPerformance),
      this.state.performanceSummary,
      stringarrayserializer.serialize(this.state.futurePerformance),
      this.state.reviewerComments,
      this.state.recommendation,
      this.state.reviewee,
      this.state.reviewer1,
      this.state.reviewer2,
      this.state.signatures,
      this.state.signatures.length === 3 ? 'COMPLETED' : 'UNDER_REVIEW',
    );
    // update backend
    await backend.updateReview(review);
    // sign review if needed
    if (this.state.signatures.some((sig: any) => sig.userId === auth.getUser().id)) {
      try {
        await backend.signReview(review.id);
      } catch (e) {
      }
    }
    // update local reviewingReviews cache
    if (auth.getUser().reviewingReviews) {
      for (var i in auth.getUser().reviewingReviews) {
        var reviewingReview = auth.getUser().reviewingReviews[i]
        if (reviewingReview.id === review.id) {
          auth.getUser().reviewingReviews[i] = review
        }
      }
    }
    // update review if own and move to dashboard with display message
    if (this.state.signatures.length === 3) {
      if (auth.getUser().review && auth.getUser().review.id === this.state.id) {
        auth.getUser().review = undefined;
      }
      this.props.history.push({
        pathname: '/',
        state: { alert: { type: 'success', message: 'Review has been completed!' } },
      });
    } else {
      if (auth.getUser().review && auth.getUser().review.id === this.state.id) {
        auth.getUser().review = review;
      }
      this.props.history.push({
        pathname: '/',
        state: { alert: { type: 'success', message: 'Review has been updated!' } },
      });
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <Grid container spacing={1}>
        <Grid item lg={12} md={12} sm={12}>
          <Paper>
            <Box p={2}>
              <Typography variant="h6" gutterBottom>
                Performance Review
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={12} lg={12}>
                  <InputLabel>Reviewee Id</InputLabel>
                  <TextField
                    disabled
                    fullWidth
                    value={this.state.reviewee.id}
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                  <InputLabel>Reviewee Name</InputLabel>
                  <TextField
                    disabled
                    fullWidth
                    value={`${this.state.reviewee.firstName} ${this.state.reviewee.lastName}`}
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                  <InputLabel>Reviewer 1</InputLabel>
                  <TextField
                    disabled
                    fullWidth
                    value={`${this.state.reviewer1.firstName} ${this.state.reviewer1.lastName}`}
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                  <InputLabel>Reviewer 2</InputLabel>
                  <TextField
                    disabled
                    fullWidth
                    value={`${this.state.reviewer2.firstName} ${this.state.reviewer2.lastName}`}
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                  <InputLabel>Section</InputLabel>
                  <TextField
                    disabled
                    fullWidth
                    value={Section[this.state.reviewer1.section]}
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                  <InputLabel>Job Title</InputLabel>
                  <TextField
                    disabled
                    fullWidth
                    value={UserRole[this.state.reviewee.role]}
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                  <InputLabel>Reviewer 1</InputLabel>
                  <Select
                    disabled
                    name="reviewer1"
                    labelId="reviewer1"
                    id="reviewer1"
                    value={this.state.reviewer1.id}
                  >
                    <MenuItem value={this.state.reviewer1.id}>
                      {this.state.reviewer1.firstName}
                      {' '}
                      {this.state.reviewer1.lastName}
                    </MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                  <InputLabel>Reviewer 2</InputLabel>
                  <Select
                    disabled
                    name="reviewer2"
                    labelId="reviewer2"
                    id="reviewer2"
                    value={this.state.reviewer2.id}
                  >
                    <MenuItem value={this.state.reviewer2.id}>
                      {this.state.reviewer2.firstName}
                      {' '}
                      {this.state.reviewer2.lastName}
                    </MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={12} md={12} lg={12} className={classes.root}>
                  <InputLabel>Past performance, achievements and outcomes</InputLabel>
                  <div id="pastPerformance">
                    {this.state.pastPerformance.map((e, i) => (
                      <div key={i}>
                        <InputLabel className={classes.listLabel}>{i}</InputLabel>
                        <TextField disabled={this.state.hasSigned || this.state.viewOnly} size="small" variant="outlined" value={e.key} onChange={(e) => this.handlePerformanceChange(e, i, 'past', 'key')} />
                        <TextField disabled={this.state.hasSigned || this.state.viewOnly} size="small" variant="outlined" value={e.val} onChange={(e) => this.handlePerformanceChange(e, i, 'past', 'val')} />
                      </div>
                    ))}
                  </div>
                  <Button disabled={this.state.hasSigned || this.state.viewOnly} size="small" variant="contained" color="primary" onClick={() => this.handlePerformanceAdd('past')}>Add</Button>
                  <Button disabled={this.state.hasSigned || this.state.viewOnly} size="small" variant="contained" color="secondary" onClick={() => this.handlePerformanceRemove('past')}>Remove Bottom</Button>
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                  <TextField
                    required
                    disabled={this.state.hasSigned || this.state.viewOnly}
                    id="performanceSummary"
                    name="performanceSummary"
                    label="Performance Summary"
                    fullWidth
                    multiline
                    rows="4"
                    value={this.state.performanceSummary}
                    onChange={this.handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={12} className={classes.root}>
                  <InputLabel>Future performance, goals, planned outcomes</InputLabel>
                  <div id="futurePerformance">
                    {this.state.futurePerformance.map((e, i) => (
                      <div key={i}>
                        <InputLabel className={classes.listLabel}>{i}</InputLabel>
                        <TextField disabled={this.state.hasSigned || this.state.viewOnly} size="small" variant="outlined" value={e.key} onChange={(e) => this.handlePerformanceChange(e, i, 'future', 'key')} />
                        <TextField disabled={this.state.hasSigned || this.state.viewOnly} size="small" variant="outlined" value={e.val} onChange={(e) => this.handlePerformanceChange(e, i, 'future', 'val')} />
                      </div>
                    ))}
                  </div>
                  <Button disabled={this.state.hasSigned || this.state.viewOnly} size="small" variant="contained" color="primary" onClick={() => this.handlePerformanceAdd('future')}>Add</Button>
                  <Button disabled={this.state.hasSigned || this.state.viewOnly} size="small" variant="contained" color="secondary" onClick={() => this.handlePerformanceRemove('future')}>Remove Bottom</Button>
                </Grid>
                {!this.state.isSelf && 
                  <div>
                  <Grid item xs={12} md={12} lg={12}>
                    <TextField
                      required
                      disabled={this.state.hasSigned || this.state.viewOnly}
                      id="reviewerComments"
                      name="reviewerComments"
                      label="Reviewer Comments"
                      fullWidth
                      multiline
                      rows="4"
                      value={this.state.reviewerComments}
                      onChange={this.handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={12} lg={12}>
                    <InputLabel>Recommendation</InputLabel>
                    <Select
                      disabled={this.state.hasSigned || this.state.viewOnly}
                      name="recommendation"
                      labelId="recommendation"
                      id="recommendation"
                      value={this.state.recommendation}
                      onChange={this.handleChange}
                    >
                      {Object.entries(recommendations).map(([key, val]) => (
                        <MenuItem key={key} value={key}>
                          {val}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                  </div>
                }
                {this.state.state === 'UNDER_REVIEW' && (
                  <Grid item xs={12} md={12} lg={12} className={classes.root}>
                    <InputLabel>Signatures</InputLabel>
                    <TableContainer>
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell align="left">Reviewee</TableCell>
                            <TableCell align="center">
                              {this.state.reviewee.firstName}
                              {' '}
                              {this.state.reviewee.lastName}
                            </TableCell>
                            <TableCell align="center">21/3/2019</TableCell>
                            <TableCell padding="checkbox">
                              <Checkbox checked={this.state.signatures.some((sig: any) => sig.userId === this.state.reviewee.id)} disabled={this.state.reviewee.id !== auth.getUser().id || this.state.hasSigned || this.state.viewOnly} name="revieweesignature" onClick={this.handleSign} />
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell align="left">Reviewer 1</TableCell>
                            <TableCell align="center">
                              {this.state.reviewer1.firstName}
                              {' '}
                              {this.state.reviewer1.lastName}
                            </TableCell>
                            <TableCell align="center">21/3/2019</TableCell>
                            <TableCell padding="checkbox">
                              <Checkbox checked={this.state.signatures.some((sig: any) => sig.userId === this.state.reviewer1.id)} disabled={this.state.reviewer1.id !== auth.getUser().id || this.state.hasSigned || this.state.viewOnly} name="reviewer1signature" onClick={this.handleSign} />
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell align="left">Reviewer 2</TableCell>
                            <TableCell align="center">
                              {this.state.reviewer2.firstName}
                              {' '}
                              {this.state.reviewer2.lastName}
                            </TableCell>
                            <TableCell align="center">21/3/2019</TableCell>
                            <TableCell padding="checkbox">
                              <Checkbox checked={this.state.signatures.some((sig: any) => sig.userId === this.state.reviewer2.id)} disabled={this.state.reviewer2.id !== auth.getUser().id || this.state.hasSigned || this.state.viewOnly} name="reviewer2signature" onClick={this.handleSign} />
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                )}
                {(!this.state.hasSigned && !this.state.viewOnly)
                  && (
                  <Grid item xs={12} md={12} lg={12}>
                    <Button variant="contained" color="primary" onClick={this.handleSubmit}>{this.state.state === 'INITIATED' ? 'Create Review' : 'Update Review'}</Button>
                  </Grid>
                  )}
                {this.state.viewOnly
                  && (
                  <Grid item xs={12} md={12} lg={12}>
                    <Button variant="contained" color="secondary" onClick={() => this.props.history.goBack()}>Back</Button>
                  </Grid>
                  )}
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

export default withRouter(withStyles(styles)(ReviewEdit));
