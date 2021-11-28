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
  failure: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    margin: "100px",
  },
  failureButton: {
    marginTop: "25px",
  },
});

const FailureDialog = (props) => {
  const [open, setOpen] = React.useState(true);
  const classes = useStyles();

  const handleClose = () => {
    props.setShowStatusModal({ ...props.showStatusModal, isFailure: false });
    setOpen(false);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle style={{ border: "2px solid black" }}>Failure</DialogTitle>
        <DialogContent style={{ border: "2px solid black" }}>
          <DialogContentText className={classes.failure}>
            {props.user.profile.displayName}'s Account is Already Activated
            <Button
              onClick={handleClose}
              variant="contained"
              color="primary"
              className={classes.failureButton}
            >
              Close
            </Button>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FailureDialog;
