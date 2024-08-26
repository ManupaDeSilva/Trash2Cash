import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from 'src/components/shared/DashboardCard';
import truckImage from '../../assets/images/others/truck.png';
import plasticsImage from '../../assets/images/others/plastic.svg';
import tinsImage from '../../assets/images/others/tin.svg';
import clothesImage from '../../assets/images/others/clothes.svg';
import booksImage from '../../assets/images/others/books.svg';
import papersImage from '../../assets/images/others/paper.svg';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import laureImg from '../../assets/images/others/LaurelWreath.png';
import rightOmg from '../../assets/images/others/right.png';
import dayjs from 'dayjs';
import InputAdornment from '@mui/material/InputAdornment';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';


const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    to: '/pickups',
    title: 'Pickups',
  },
  {
    title: 'Pickup Details',
  },
];

const ConfirmDeleteDialog = ({ open, handleCancel, handleDeleteConfirm }) => {
  return (
    <Dialog open={open} onClose={handleCancel} sx={{ borderRadius: '8px', minWidth: '300px' }}>
      <DialogTitle sx={{ textAlign: 'center' }}>
        <WarningIcon sx={{ fontSize: '30px', color: 'red', marginBottom: '8px' }} />
        <br />
        Are you sure?
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ textAlign: 'center' }}>
          This action will delete the pickup from the system.
          <br />
          You won't be able to revert this!
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button
          onClick={handleDeleteConfirm}
          sx={{
            backgroundColor: 'red',
            color: 'white',
            '&:hover': {
              backgroundColor: '#8B0000', // Hover background color
            },
          }}
        >
          Yes, delete it
        </Button>
        <Button
          onClick={handleCancel}
          variant="outlined"
          sx={{
            color: 'red', // Text color
            borderColor: 'red', // Outlined border color
            '&:hover': {
              backgroundColor: 'red', // Hover background color
            },
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const DeleteConfirmationDialog = ({ open, handleClose }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{ borderRadius: '8px', minWidth: '500px', minHeight: '400px' }}
    >
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div
          style={{ position: 'relative', width: '100px', height: '100px', marginBottom: '16px' }}
        >
          <img
            src={laureImg}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              maxWidth: '100px',
            }}
          />
          <img
            src={rightOmg}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(50%, -50%)',
              maxWidth: '30px',
            }}
          />
        </div>
        <Typography variant="h5" sx={{ textAlign: 'center', color: 'primary' }}>
          PICKUP DELETED !
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button onClick={handleClose} variant="contained" color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// New Reschedule Dialog Component
const RescheduleConfirmationDialog = ({ open, handleClose }) => {
  const handleDateChange = (date) => {
    // Your date change logic here
  };

  const [pickupDetails, setPickupDetails] = useState({});

  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    // Your handle change logic here
  };
  

  return (
    <Dialog open={open} onClose={handleClose} sx={{ borderRadius: '8px', minWidth: '300px' ,}}>
      <DialogTitle sx={{ textAlign: 'center', color: '#0F6C85' }}>RE-SCHEDULE PICKUP</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ textAlign: 'center', fontWeight: 'bold', color: '#798A8E' }}>
          Date & Time : 12 / 06 / 2024 <br />
          11.00 Am - 12.00 Pm
          <br />
          <br />
          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Select a Date"
                name="dateTime"
                value={pickupDetails.dateTime}
                onChange={handleDateChange}
                renderInput={(props) => (
                  <TextField
                    {...props}
                    fullWidth
                    variant="outlined"
                    error={!!errors.dateTime}
                    helperText={errors.dateTime}
                    InputProps={{
                      ...props.InputProps,
                      endAdornment: (
                        <InputAdornment position="end">
                          <CalendarTodayIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <br />
          <Grid item xs={12} md={6}>
      <FormControl fullWidth error={!!errors.timeSlot}>
        <InputLabel id="timeSlot-label">Select Time Slot</InputLabel>
        <Select
          labelId="timeSlot-label"
          label="Time Slot"
          name="timeSlot"
          value={pickupDetails.timeSlot}
          onChange={handleChange}
          renderValue={(selected) => {
            if (!selected) {
              return <em>Select Time Slot</em>;
            }
            return selected;
          }}
        >
          <MenuItem value="" disabled>
            <em>Select Time Slot</em>
          </MenuItem>
          <MenuItem value="timeslot01">Time Slot 01</MenuItem>
          <MenuItem value="timeslot02">Time Slot 02</MenuItem>
        </Select>
      </FormControl>
    </Grid>
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button onClick={handleClose} variant="contained" color="primary">
          Re-Schedule
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const ViewPickup = () => {
  const { pickupID } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { pickup } = location.state;
  const [pickupDetails, setPickupDetails] = useState({
    id: 'Fetching...',
    customerName: 'Fetching...',
    driverName: 'Fetching...',
    dateTime: 'Fetching...',
    address: 'Fetching...',
    timeslots: 'Fetching...',
    status: 'Fetching...',
  });

  const apiKey = 'AIzaSyAqiRkh8Sj4hGbLbMiezln6AFIXG-6POFg'; // Replace with your actual API key

  useEffect(async () => {
    if (pickup) {
      setPickupDetails({
        id: pickupID,
        customerName: pickup.home_point.user.name,
        driverName: pickup.driver.name,
        dateTime: formatDate(pickup.home_point.timeslot.date),
        address: await fetchAddressFromCoordinates(pickup.home_point.location),
        timeslots: `${formatTime(pickup.home_point.timeslot.from)} - ${formatTime(
          pickup.home_point.timeslot.to,
        )}`,
        status: capitalize(pickup.pickupStatus.status),
      });
    }
  }, [pickup]);

  const formatDate = (date) => {
    return dayjs(date).format('MM/DD/YYYY');
  };

  const fetchAddressFromCoordinates = async (jsonString) => {
    try {
      const jsonObject = JSON.parse(jsonString);
      const { lat, long: lon } = jsonObject;

      if (!lat || !lon) {
        throw new Error('Invalid JSON format. Please provide both lat and long.');
      }

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${apiKey}`,
      );
      const data = await response.json();

      if (data.status === 'OK' && data.results && data.results[0]) {
        const addressParts = data.results[0].formatted_address;
        return addressParts;
      } else {
        throw new Error('Unable to fetch address');
      }
    } catch (error) {
      throw new Error(`Error: ${error.message}`);
    }
  };

  const formatTime = (pickupTime) => {
    if (!pickupTime) return 'N/A'; // Handle null or undefined cases

    // Split the time string into hours, minutes, and seconds
    const [hours, minutes, seconds] = pickupTime.split(':');

    // Create a new Date object
    const dateObj = new Date();

    // Set hours, minutes, and seconds to the Date object
    dateObj.setHours(hours);
    dateObj.setMinutes(minutes);
    dateObj.setSeconds(seconds);

    // Format the Date object to AM/PM format
    const formattedTime = dateObj.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

    return formattedTime;
  };

  const capitalize = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  // State for Dialogs
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletedOpen, setDeletedOpen] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false); // New state for reschedule dialog

  const handleDelete = () => {
    setConfirmOpen(true);
  };

  const handleReschedule = () => {
    setRescheduleOpen(true); // Open the reschedule dialog
  };

  const handleCancel = () => {
    setConfirmOpen(false);
  };

  const handleDeleteConfirm = () => {
    // Perform delete operation here (e.g., call API to delete pickup)
    console.log(`Pickup with ID: ${pickupID} deleted`);
    setConfirmOpen(false);
    setDeletedOpen(true);
    // Optionally, navigate to another page after deletion
    // navigate('/pickups');
  };

  const handleCloseDeleted = () => {
    setDeletedOpen(false);
    // Optionally, perform any additional actions after closing the deleted dialog
  };

  const handleCloseReschedule = () => {
    setRescheduleOpen(false);
    // Optionally, perform any additional actions after closing the reschedule dialog
  };

  const handleAssignRider = () => {
    navigate(`/assign-rider/${pickupID}`);
  };

  return (
    <PageContainer title="Pickup Details" description="View Pickup Details">
      {/* breadcrumb */}
      <Breadcrumb title="Pickup Details" items={BCrumb} />
      {/* end breadcrumb */}
      <DashboardCard title="">
        <Box display="flex" flexDirection="column" alignItems="center">
          <img src={truckImage} alt="" style={{ width: '337px', height: '188px' }} />
        </Box>
        <Paper elevation={3} style={{ padding: '20px', margin: '20px' }}>
          <Box display="flex" flexDirection="column" alignItems="left">
            <Typography variant="h4" gutterBottom>
              Pickup Details
            </Typography>
            <br></br>
            <br></br>
          </Box>
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Pickup ID"
                value={pickupDetails.id}
                variant="outlined"
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Customer Name"
                value={pickupDetails.status}
                variant="outlined"
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Date & Time"
                value={pickupDetails.customerName}
                variant="outlined"
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Contact"
                value={pickupDetails.driverName}
                variant="outlined"
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid container spacing={2} style={{ marginTop: '20px', marginLeft: '30px' }}>
              <Grid item xs={12}>
                <TextField
                  label="Address"
                  value={pickupDetails.address}
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
            </Grid>
            <Grid item xs={12} container justifyContent="flex-end" alignItems="center">
              <Box display="flex" gap={2}>
                <Button
                  variant="contained"
                  style={{ fontWeight: 'bold' }}
                  sx={{
                    backgroundColor: '#FFFFFF',
                    color: '#116378',
                    border: '1px solid #116378',
                    '&:hover': {
                      backgroundColor: '#116378',
                    },
                  }}
                  onClick={handleAssignRider}
                >
                  Assign Rider
                </Button>
                <Button
                  variant="contained"
                  style={{ fontWeight: 'bold' }}
                  sx={{ backgroundColor: '#116378', '&:hover': { backgroundColor: '#116378' } }}
                  onClick={handleReschedule}
                >
                  Re-Schedule
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
        <Paper elevation={3} style={{ padding: '20px', margin: '20px' }}>
          <Box display="flex" flexDirection="column" alignItems="left">
            <Typography variant="h4" gutterBottom>
              Quantities Details
            </Typography>
            <br></br>
            <br></br>
          </Box>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6} container alignItems="center">
              <img
                src={plasticsImage}
                alt=""
                style={{ width: '50px', height: '70px', marginRight: '20px', marginLeft: '250px' }}
              />
              <Typography
                variant="body1"
                style={{ marginBottom: '20px', fontWeight: 'bold', fontSize: '16px' }}
              >
                {pickup.home_point.itemList.gbottles} Kg
              </Typography>
            </Grid>

            <Grid item xs={12} md={6} container alignItems="center">
              <img
                src={clothesImage}
                alt=""
                style={{ width: '50px', height: '70px', marginRight: '20px', marginLeft: '200px' }}
              />
              <Typography
                variant="body2"
                style={{ marginBottom: '20px', fontWeight: 'bold', fontSize: '16px' }}
              >
                {pickup.home_point.itemList.clothes} Pieces
              </Typography>
            </Grid>

            <Grid item xs={12} md={6} container alignItems="center">
              <img
                src={papersImage}
                alt=""
                style={{ width: '50px', height: '70px', marginRight: '20px', marginLeft: '250px' }}
              />
              <Typography
                variant="body3"
                style={{ marginBottom: '20px', fontWeight: 'bold', fontSize: '16px' }}
              >
                {pickup.home_point.itemList.papers} Kg
              </Typography>
            </Grid>

            <Grid item xs={12} md={6} container alignItems="center">
              <img
                src={booksImage}
                alt=""
                style={{ width: '50px', height: '70px', marginRight: '20px', marginLeft: '200px' }}
              />
              <Typography
                variant="body4"
                style={{ marginBottom: '20px', fontWeight: 'bold', fontSize: '16px' }}
              >
                {pickup.home_point.itemList.books} Books
              </Typography>
            </Grid>

            <Grid item xs={12} md={6} container alignItems="center">
              <img
                src={tinsImage}
                alt=""
                style={{ width: '50px', height: '70px', marginRight: '20px', marginLeft: '250px' }}
              />
              <Typography
                variant="body5"
                style={{ marginBottom: '20px', fontWeight: 'bold', fontSize: '16px' }}
              >
                {pickup.home_point.itemList.pct} Kg
              </Typography>
            </Grid>

            <Grid item xs={12} container justifyContent="flex-end" alignItems="center">
            
            </Grid>
          </Grid>
        </Paper>
      </DashboardCard>

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={confirmOpen}
        handleCancel={handleCancel}
        handleDeleteConfirm={handleDeleteConfirm}
      />
      {/* Deleted Confirmation Dialog */}
      <DeleteConfirmationDialog open={deletedOpen} handleClose={handleCloseDeleted} />
      {/* Reschedule Confirmation Dialog */}
      <RescheduleConfirmationDialog open={rescheduleOpen} handleClose={handleCloseReschedule} />
    </PageContainer>
  );
};

export default ViewPickup;
