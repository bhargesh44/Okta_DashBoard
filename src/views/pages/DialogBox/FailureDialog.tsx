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
  failureBoxTitle: {
    border: "2px solid black",
  },
  failureBoxContent: {
    border: "2px solid black",
  },
  failureBoxContentText: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    margin: "100px",
  },
  failureBoxButton: {
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
        <DialogTitle className={classes.failureBoxTitle}>Failure</DialogTitle>
        <DialogContent className={classes.failureBoxContent}>
          <DialogContentText className={classes.failureBoxContentText}>
            {props.user.profile.displayName.split(" ")[0]}'s Account is Already
            Activated
            <Button
              onClick={handleClose}
              variant="contained"
              color="primary"
              className={classes.failureBoxButton}
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
