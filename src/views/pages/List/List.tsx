

import React, { useEffect, useState } from "react";
import "../../../Components/Table/table.css";
import { Button, Grid, TextField, Typography } from "@mui/material";
import CachedIcon from "@mui/icons-material/Cached";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";

import { useOktaAuth } from "@okta/okta-react";

import { AgGridReact } from "ag-grid-react";

import moment from "moment";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import SuccessDialog from "../DialogBox/SuccessDialog";
import FailureDialog from "../DialogBox/FailureDialog";

function List() {
  const { oktaAuth, authState } = useOktaAuth();

  const [data, setData] = useState<any>([]);

  const [startDate, setStartDate] = useState<any>(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const [showStatusModal, setShowStatusModal] = useState<any>({
    isSuccess: false,
    isFailure: false,
  });
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

  const columns = [
    {
      headerName: "Name",
      field: "profile.displayName",
    },
    {
      headerName: "Email",
      field: "profile.email",
    },
    {
      headerName: "SecondMail",
      field: "profile.secondEmail",
    },
    {
      headerName: "Status",
      field: "status",
    },
    {
      headerName: "Person Type",
      field: "profile.employmentStatus",
    },
    {
      headerName: "Location",
      field: "profile.workLocation",
    },
    {
      headerName: "Start Date",
      field: "profile.hireDate",
    },
    {
      headerName: "Title",
      field: "profile.title",
    },
    {
      headerName: "Department",
      field: "profile.department",
    },
  ];

  const defaultColDef = {
    sortable: true,
    filter: true,
  };

  const rowSelectionType = "single";
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const onSelectionChanged = (user) => {
    //alert(user.api.getSelectedRows()[0].id);

    const selectedRows = user.api.getSelectedRows()[0];
    console.log("selected Row ", selectedRows);

    setSelectedUser(selectedRows);
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

  if (!authState) return null;

  const logout = async () => oktaAuth.signOut();

  return (
    <>
      {selectedUser && showStatusModal.isSuccess && (
        <SuccessDialog
          user={selectedUser}
          getUserByHireDate={getUserByHireDate}
          startDate={startDate}
          setShowStatusModal={setShowStatusModal}
          showStatusModal={showStatusModal}
          setSelectedUser={setSelectedUser}
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
                id="btn"
                style={{ marginBottom: "5px" }}
                variant="contained"
                onClick={changeAccountStatus}
                disabled={selectedUser ? false : true}
              >
                Active Account
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid container direction="row">
        <Grid item lg={2} md={2} sm={2} xs={2} mt={1}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(newStartDate) => {
                setStartDate(moment(newStartDate).format("YYYY-MM-DD"));
                getUserByHireDate(moment(newStartDate).format("YYYY-MM-DD"));
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item lg={10} md={10} sm={10} xs={10}>
          <div
            className="ag-theme-alpine"
            style={{ height: 425, width: "100%" }}
          >
            <AgGridReact
              rowData={data}
              columnDefs={columns}
              defaultColDef={defaultColDef}
              rowSelection={rowSelectionType}
              onSelectionChanged={onSelectionChanged}
              pagination={true}
              //paginationPageSize={7}
              paginationAutoPageSize={true}
            />
          </div>
        </Grid>
      </Grid>
    </>
  );
}

export default List;
