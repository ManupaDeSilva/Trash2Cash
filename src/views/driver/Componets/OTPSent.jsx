
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Typography,
} from '@mui/material';

const OTPSent = () => {
  const navigate = useNavigate();

  const handleOK = () => {
    navigate('/pickups');
  };

  return (
    <Dialog
      open={true}
      onClose={handleOK}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { padding: 4, borderRadius: 2 },
      }}
    >
      <DialogTitle>
       
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography sx={{ fontSize: 18, color: '#116378', fontWeight: 'bold', mt: 1, textAlign: 'center' }}>
            OTP sent to your phone number
          </Typography>
        </DialogContentText>
        <br />
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button onClick={handleOK} color="primary" >
          OK
          </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OTPSent;
