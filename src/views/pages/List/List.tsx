import React, { useEffect, useState } from "react";

import "../../../Components/Table/table.css";

import { Button, Grid, TextField, Typography } from "@mui/material";
import CachedIcon from "@mui/icons-material/Cached";

import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";

import { authFetch } from "../../../Provider/AuthProvider";

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

  const getUserByHireDate = (hireDate) => {
    const dateRequestOptions = {
      method: "GET",
    };

    authFetch(
      `${process.env.REACT_APP_BASE_URL}/api/v1/users/?search=profile.hireDate Eq "${hireDate}"`,
      dateRequestOptions
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
    const selectedRows = user.api.getSelectedRows()[0];

    setSelectedUser(selectedRows);
  };

  const activeAccount = () => {
    const activeRequestOptions = {
      method: "POST",
    };

    authFetch(
      `${process.env.REACT_APP_BASE_URL}/api/v1/users/${selectedUser.id}/lifecycle/activate?sendEmail=true`,
      activeRequestOptions
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

      <Grid container direction="row" spacing={2}>
        <Grid item lg={2} md={2} sm={2} xs={2}>
          <Typography variant="h6">Filter By</Typography>
        </Grid>
        <Grid item lg={10} md={10} sm={10} xs={10}>
          <Grid container>
            <Grid item lg={10} md={8} sm={8} xs={8}>
              <Typography variant="h6">
                User List
                <Button color="primary">
                  <CachedIcon onClick={() => getUserByHireDate(startDate)} />
                </Button>
              </Typography>
            </Grid>
            <Grid
              item
              lg={2}
              md={4}
              sm={4}
              xs={4}
              display="flex"
              justifyContent="end"
            >
              <Button
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

      <Grid container direction="row" spacing={2}>
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
              rowMultiSelectWithClick={true}
              onSelectionChanged={onSelectionChanged}
              pagination={true}
              paginationAutoPageSize={true}
            />
          </div>
        </Grid>
      </Grid>
    </>
  );
}

export default List;
