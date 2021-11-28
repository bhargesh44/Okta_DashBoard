import React, { useEffect, useState } from "react";
import "../../../Components/Table/table.css";
import {
  Alert,
  Box,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { makeStyles } from "@material-ui/core";
import SuccessDialog from "../DialogBox/SuccessDialog";
import CachedIcon from "@mui/icons-material/Cached";
import FailureDialog from "../DialogBox/FailureDialog";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import SortIcon from "@mui/icons-material/ImportExport";
import { useOktaAuth } from "@okta/okta-react";

import moment from "moment";

const useStyles = makeStyles({
  active: {
    color: "white",
  },
  deactive: {
    color: "black",
  },
  tableBody: {
    overflowY: "scroll",
  },
});

function List() {
  const { oktaAuth, authState } = useOktaAuth();

  const classes = useStyles();

  const [data, setData] = useState<any>([]);

  const [startDate, setStartDate] = useState<any>(
    moment(new Date()).format("YYYY-MM-DD")
  );

  const [selectedUser, setSelectedUser] = useState<any>(false);

  const [showStatusModal, setShowStatusModal] = useState<any>({
    isSuccess: false,
    isFailure: false,
  });

  const [order, setOrder] = useState("ASC");
  const token = process.env.REACT_APP_OKTA_TOKEN;

  const getUserByHireDate = (hireDate) => {
    fetch(
      `${process.env.REACT_APP_BASE_URL}/api/v1/users/?search=profile.hireDate Eq "${hireDate}"`,
      {
        method: "GET",
        headers: {
          Authorization: `SSWS ${token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((jsonData) => setData(jsonData));
  };

  useEffect(() => getUserByHireDate(startDate), []);

  const sortByStatus = (colName, forProfile) => {
    if (order === "ASC") {
      if (forProfile) {
        var sorted = [...data].sort((a, b) =>
          a["profile"][colName] > b["profile"][colName] ? 1 : -1
        );
      } else {
        var sorted = [...data].sort((a, b) =>
          a[colName] > b[colName] ? 1 : -1
        );
      }

      setData(sorted);
      setOrder("DSC");
    }
    if (order === "DSC") {
      if (forProfile) {
        var sorted = [...data].sort((a, b) =>
          a["profile"][colName] < b["profile"][colName] ? 1 : -1
        );
      } else {
        var sorted = [...data].sort((a, b) =>
          a[colName] < b[colName] ? 1 : -1
        );
      }
      setData(sorted);
      setOrder("ASC");
    }
  };

  if (!authState) return null;

  const logout = async () => oktaAuth.signOut();

  const toggleActive = (user) => {
    if (selectedUser?.id === user.id) {
      setSelectedUser(null);
    } else {
      setSelectedUser(user);
    }
  };

  const activeAccount = () => {
    fetch(
      `${process.env.REACT_APP_BASE_URL}/api/v1/users/${selectedUser.id}/lifecycle/activate?sendEmail=true`,
      {
        method: "POST",
        headers: {
          ContentType: "application/json",
          Accept: "application/json",
          Authorization: `SSWS ${token}`,
        },
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Something went wrong!");
        }
      })
      .then((responseJson) => {
        setShowStatusModal({ ...showStatusModal, isSuccess: true });
      })
      .catch((error) => {
        setShowStatusModal({ ...showStatusModal, isFailure: true });
      });
  };

  const changeAccountStatus = () => {
    activeAccount();
  };

  return (
    <>
      {selectedUser && showStatusModal.isSuccess && (
        <SuccessDialog
          user={selectedUser}
          getUserByHireDate={getUserByHireDate}
          startDate={startDate}
          setShowStatusModal={setShowStatusModal}
          showStatusModal={showStatusModal}
        />
      )}
      {selectedUser && showStatusModal.isFailure && (
        <FailureDialog
          user={selectedUser}
          setShowStatusModal={setShowStatusModal}
          showStatusModal={showStatusModal}
        />
      )}
      <Grid
        container
        spacing={2}
        direction="row"
        mt={4}
        display="flex"
        justifyContent="end"
        mb={2}
      >
        <Button variant="contained" color="secondary" onClick={logout}>
          Logout
        </Button>
      </Grid>

      <Grid container direction="row">
        <Grid item lg={2}>
          <Typography variant="h5">Filter By</Typography>
        </Grid>
        <Grid item lg={10}>
          <Grid container>
            <Grid item lg={10}>
              <Typography variant="h5">
                User List
                <Button color="primary">
                  <CachedIcon onClick={() => getUserByHireDate(startDate)} />
                </Button>
              </Typography>
            </Grid>
            <Grid item lg={2} display="flex" justifyContent="end">
              <Button
                style={{ marginBottom: "5px" }}
                variant="contained"
                onClick={changeAccountStatus}
                disabled={!selectedUser}
              >
                Active Account
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid container direction="row">
        <Grid item lg={2} mt={1}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(newStartDate) => {
                setSelectedUser(null);
                setStartDate(moment(newStartDate).format("YYYY-MM-DD"));
                getUserByHireDate(moment(newStartDate).format("YYYY-MM-DD"));
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>

          <br />
          <br />
        </Grid>
        <Grid item lg={10}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Box sx={{ display: "flex", flexDirection: "row" }}>
                    <Typography variant="subtitle1">Name</Typography>
                    <SortIcon
                      onClick={() => sortByStatus("displayName", true)}
                      style={{ cursor: "pointer", color: "white" }}
                    />
                  </Box>
                </TableCell>

                <TableCell>
                  <Typography variant="subtitle1">
                    Work Email (Username)
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1">Secondary Email</Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", flexDirection: "row" }}>
                    <Typography variant="subtitle1">Status</Typography>
                    <SortIcon
                      onClick={() => sortByStatus("status", false)}
                      style={{ cursor: "pointer", color: "white" }}
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1">Person Type</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1">Location</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1">Start Date</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1">Title</Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", flexDirection: "row" }}>
                    <Typography variant="subtitle1">Department</Typography>
                    <SortIcon
                      onClick={() => sortByStatus("department", true)}
                      style={{ cursor: "pointer", color: "white" }}
                    />
                  </Box>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody className="tableBody">
              {data?.map((user, id) => (
                <TableRow
                  id={user.id}
                  style={
                    selectedUser?.id === user.id
                      ? { background: "gray" }
                      : { background: "#f2f2f2" }
                  }
                  key={user.id}
                  onClick={() => toggleActive(user)}
                >
                  <TableCell
                    className={
                      selectedUser?.id === user.id
                        ? classes.active
                        : classes.deactive
                    }
                  >
                    {user.profile.displayName}
                  </TableCell>
                  <TableCell
                    className={
                      selectedUser?.id === user.id
                        ? classes.active
                        : classes.deactive
                    }
                  >
                    {user.profile.email}
                  </TableCell>
                  <TableCell
                    className={
                      selectedUser?.id === user.id
                        ? classes.active
                        : classes.deactive
                    }
                  >
                    {user.profile.secondEmail}
                  </TableCell>
                  <TableCell
                    className={
                      selectedUser?.id === user.id
                        ? classes.active
                        : classes.deactive
                    }
                  >
                    {user.status}
                  </TableCell>
                  <TableCell
                    className={
                      selectedUser?.id === user.id
                        ? classes.active
                        : classes.deactive
                    }
                  >
                    {user.profile.employmentStatus}
                  </TableCell>
                  <TableCell
                    className={
                      selectedUser?.id === user.id
                        ? classes.active
                        : classes.deactive
                    }
                  >
                    {user.profile.workLocation}
                  </TableCell>
                  <TableCell
                    className={
                      selectedUser?.id === user.id
                        ? classes.active
                        : classes.deactive
                    }
                  >
                    {user.profile.hireDate}
                  </TableCell>
                  <TableCell
                    className={
                      selectedUser?.id === user.id
                        ? classes.active
                        : classes.deactive
                    }
                  >
                    {user.profile.title}
                  </TableCell>
                  <TableCell
                    className={
                      selectedUser?.id === user.id
                        ? classes.active
                        : classes.deactive
                    }
                  >
                    {user.profile.department}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    </>
  );
}

export default List;
