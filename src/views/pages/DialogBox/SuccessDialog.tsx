import React from "react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";

import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  success: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    margin: "100px",
  },
  successButton: {
    marginTop: "25px",
  },
});

const SuccessDialog = (props) => {
  const [open, setOpen] = React.useState(true);
  const classes = useStyles();

  const handleClose = () => {
    props.getUserByHireDate(props.startDate);
    props.setShowStatusModal({ ...props.showStatusModal, isSuccess: false });
    props.setSelectedUser(null);
    setOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle style={{ border: "2px solid black" }}>Success</DialogTitle>
        <DialogContent style={{ border: "2px solid black" }}>
          <DialogContentText className={classes.success}>
            {props.user.profile.displayName.split(" ")[0]}'s Account is
            Activated
            <Button
              onClick={handleClose}
              variant="contained"
              color="primary"
              className={classes.successButton}
            >
              Close
            </Button>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SuccessDialog;
