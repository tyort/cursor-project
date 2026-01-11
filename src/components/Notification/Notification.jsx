import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import './Notification.css';

export default function Notification({ open, message, severity = 'warning', onClose }) {
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      className="notification"
    >
      <Alert onClose={handleClose} severity={severity} className="notification__alert">
        {message}
      </Alert>
    </Snackbar>
  );
}

