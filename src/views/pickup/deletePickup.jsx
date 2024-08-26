import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Button, IconButton
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

const DeletePickup = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleDelete = () => {
    // Perform delete operation here (e.g., call API to delete pickup)
    console.log(`Pickup with ID: ${id} deleted`);
    navigate('/pickups');
  };

  const handleCancel = () => {
    navigate('/pickups');
  };

  return (
    <Dialog open={true} onClose={handleCancel}>
      <DialogTitle>
        <WarningIcon style={{ color: 'red', marginRight: '8px' }} />
        Are you sure?
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          This action will delete the pickup from the system. You won't be able to revert this!
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={handleDelete} color="secondary">
          Yes, delete it
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeletePickup;
