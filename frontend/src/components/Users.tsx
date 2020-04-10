import { Button } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import {
  createStyles, lighten, makeStyles, Theme, withStyles,
} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { useStyles } from '@material-ui/pickers/views/Calendar/SlideTransition';
import React, { Component } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';

import User from '../model/User';
import backend from '../services/backend';
import auth from '../utils/auth';

interface HeadCell {
  id: string;
  label: string;
}

const headCells: HeadCell[] = [
  { id: 'userId', label: 'User Id' },
  { id: 'firstName', label: 'First name' },
  { id: 'lastName', label: 'Last name' },
];

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  // const { classes, rowCount } = props;

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="center"
            padding="default"
          >
            {headCell.label}
          </TableCell>
        ))}
        <TableCell align="center" />
        {auth.getUser().authenticationRole === 'HR_EMPLOYEE'
          && <TableCell align="center" padding="checkbox" />}
      </TableRow>
    </TableHead>
  );
}

const useToolbarStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
  theme.palette.type === 'light' ? {
    color: theme.palette.secondary.main,
    backgroundColor: lighten(theme.palette.secondary.light, 0.85),
  } : {
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.secondary.dark,
  },
  title: {
    flex: '1 1 100%',
  },
  create: {
    float: 'right',
  },
}));

interface EnhancedTableToolbarProps {

}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const classes = useToolbarStyles();

  return (
    <Toolbar>
      <Typography className={classes.title} variant="h6" id="tableTitle">
        Users
        <Link to="/users/new">
          <Button className={classes.create} size="small" variant="contained" color="default">Create User</Button>
        </Link>
      </Typography>
    </Toolbar>
  );
};

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

interface UsersState {
  users: Array<User>;
  page: number;
  rowsPerPage: number;
  emptyRows: number;
}

interface UsersProps extends RouteComponentProps {
  classes: any;
}

class Users extends Component<UsersProps, UsersState> {
  constructor(props: UsersProps) {
    super(props);

    this.state = {
      users: [],
      page: 0,
      rowsPerPage: 5,
      emptyRows: 0,
    };

    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
    this.fetchUsers = this.fetchUsers.bind(this);

    this.fetchUsers();
  }

  async fetchUsers() {
    const totalUsers = await backend.getTotalUsers();
    const start = this.state.rowsPerPage * this.state.page;
    let end = (start + this.state.rowsPerPage) - 1;
    if (end > totalUsers) {
      end = totalUsers;
    }
    const users = await backend.getUsers(start, end);
    this.setState({
      ...this.state,
      users,
      emptyRows: this.state.rowsPerPage - Math.min(this.state.rowsPerPage, users.length - this.state.page * this.state.rowsPerPage),
    });
  }

  handleChangePage(event: any, newPage: number) {
    this.setState({
      ...this.state,
      page: newPage,
      emptyRows: this.state.rowsPerPage - Math.min(this.state.rowsPerPage, this.state.users.length - newPage * this.state.rowsPerPage),
    });
  }

  handleViewRecords(user: User) {
    this.props.history.push({
      pathname: '/records',
      state: { user },
    });
  }

  handleEdit(user: User) {
    this.props.history.push({
      pathname: '/details',
      state: { user },
    });
  }

  handleChangeRowsPerPage(event: React.ChangeEvent<HTMLInputElement>) {
    const rowsPerPage = parseInt(event.target.value, 10);
    this.setState({
      ...this.state,
      page: 0,
      rowsPerPage,
      emptyRows: rowsPerPage - Math.min(rowsPerPage, this.state.users.length - 0 * rowsPerPage),
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <EnhancedTableToolbar />
          <TableContainer>
            <Table
              className={classes.table}
              aria-labelledby="tableTitle"
              size="medium"
              aria-label="enhanced table"
            >
              <EnhancedTableHead
                classes={classes}
                rowCount={this.state.users.length}
              />
              <TableBody>
                {this.state.users
                  .slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage)
                  .map((user, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        tabIndex={-1}
                        key={user.id}
                      >
                        <TableCell component="th" id={labelId} scope="row" align="center">
                          {user.id}
                        </TableCell>
                        <TableCell align="center">{user.firstName}</TableCell>
                        <TableCell align="center">{user.lastName}</TableCell>
                        <TableCell align="center">
                          <Button size="small" variant="contained" color="primary" onClick={() => this.handleViewRecords(user)}>View Records</Button>
                        </TableCell>
                        {auth.getUser().authenticationRole === 'HR_EMPLOYEE' && (
                          <TableCell align="center">
                            <Button size="small" variant="contained" color="primary" onClick={() => this.handleEdit(user)}>Edit</Button>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
                {this.state.emptyRows > 0 && (
                <TableRow style={{ height: 53 * this.state.emptyRows }}>
                  <TableCell colSpan={4} />
                </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={this.state.users.length}
            rowsPerPage={this.state.rowsPerPage}
            page={this.state.page}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(Users);
