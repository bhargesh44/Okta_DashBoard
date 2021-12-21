import React from "react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  successBoxTitle: {
    border: "2px solid black",
  },
  successBoxContent: {
    border: "2px solid black",
  },
  successBoxContentText: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    margin: "100px",
  },
  successBoxButton: {
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
        <DialogTitle className={classes.successBoxTitle}>Success</DialogTitle>
        <DialogContent className={classes.successBoxContent}>
          <DialogContentText className={classes.successBoxContentText}>
            {props.user.profile.displayName.split(" ")[0]}'s Account is
            Activated
            <Button
              onClick={handleClose}
              variant="contained"
              color="primary"
              className={classes.successBoxButton}
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
