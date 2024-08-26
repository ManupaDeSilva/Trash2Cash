import React, { useState } from 'react';
import {
  TextField,
  Button,
  Select,
  Paper,
  Typography,
  InputLabel,
  Grid,
  Box,
  MenuItem,
  InputAdornment,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import truckImage from '../../assets/images/others/truck.png';
import plasticsImage from '../../assets/images/others/plastic.svg';
import tinsImage from '../../assets/images/others/tin.svg';
import clothesImage from '../../assets/images/others/clothes.svg';
import booksImage from '../../assets/images/others/books.svg';
import papersImage from '../../assets/images/others/paper.svg';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const AddPickup = () => {
  const [pickupDetails, setPickupDetails] = useState({
    pickupID: '',
    customerName: '',
    driverName: '',
    dateTime: null,
    address: '',
    contact: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPickupDetails({
      ...pickupDetails,
      [name]: value,
    });
  };

  const handleDateChange = (date) => {
    setPickupDetails({
      ...pickupDetails,
      dateTime: date,
    });
  };

  const timeSots = [
    { label: 'timeslot1', value: 'timeslot1' },
    { label: 'timeslot2', value: 'timeslot2' },
    // Add more timeslot options here
  ];

  const [errors, setErrors] = useState({});

  // these validations are not correct validations only for testing
  const validate = () => {
    let tempErrors = {};

    if (pickupDetails.pickupID.trim().length !== 4) {
      tempErrors.pickupID = 'Pickup ID must be 4 characters long.';
    }

    if (
      pickupDetails.customerName.trim().length === 0 ||
      pickupDetails.customerName.trim().length > 30 ||
      !/^[a-zA-Z\s]+$/.test(pickupDetails.customerName.trim())
    ) {
      tempErrors.customerName = 'Customer Name must be a string with a maximum of 30 characters.';
    }

    if (
      pickupDetails.driverName.trim().length === 0 ||
      pickupDetails.driverName.trim().length > 30 ||
      !/^[a-zA-Z\s]+$/.test(pickupDetails.driverName.trim())
    ) {
      tempErrors.driverName = 'Driver Name must be a string with a maximum of 30 characters.';
    }

    if (!pickupDetails.dateTime) {
      tempErrors.dateTime = 'Date & Time is required.';
    }

    if (!pickupDetails.address.trim().length === 0) {
      tempErrors.address = 'Address is required.';
    }

    if (!/^\d{10}$/.test(pickupDetails.contact.trim())) {
      tempErrors.contact = 'Contact Number must be a 10-digit number.';
    }

    setErrors(tempErrors);

    return Object.keys(tempErrors).length === 0;
  };

  const handleAdd = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    console.log('Pickup Details:', pickupDetails);

    setPickupDetails({
      pickupID: '',
      customerName: '',
      driverName: '',
      dateTime: null,
      address: '',
      contact: '',
    });
  };

  const handleCancel = (e) => {
    e.preventDefault();
    console.log('Cancel Edit Pickup Details:', pickupDetails);
  };

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
      title: 'Add Pickup',
    },
  ];

  return (
    <PageContainer title="Add Details" description="View Pickup Details">
      <Breadcrumb title="Add a Pickup" items={BCrumb} />
      <DashboardCard title="">
        <Box display="flex" flexDirection="column" alignItems="center">
          <img src={truckImage} alt="" style={{ width: '337px', height: '188px' }} />
        </Box>
        <Paper elevation={3} style={{ padding: '20px', margin: '20px' }}>
          <Box display="flex" flexDirection="column" alignItems="left">
            <Typography variant="h4" gutterBottom>
              Pickup Details
            </Typography>
            <br />
            <br />
          </Box>

          <Grid container spacing={3}>
            {/* Customer Name */}
            <Grid item xs={12}>
              <TextField
                label="Customer Name"
                name="customerName"
                placeholder="Select Customer (if customer is not in the list please add as a new customer in user section)"
                value={pickupDetails.customerName}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                error={!!errors.customerName}
                helperText={errors.customerName}
              />
            </Grid>

            {/* Date & Time Slot */}
            <Grid item xs={12} md={6}>
              <br />

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Date & Time"
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
            <Grid item xs={12} md={6}>
              <InputLabel id="timeSlot-label">Time Slot (Please select a Date first)</InputLabel>
              <Select
                labelId="timeSlot-label"
                label="Time Slot"
                name="timeSlot"
                value={pickupDetails.timeSlot}
                onChange={handleChange}
                fullWidth
                error={!!errors.timeSlot}
                helperText={errors.timeSlot}
              >
                <MenuItem value="timeslot01">Time Slot 01</MenuItem>
                <MenuItem value="timeslot02">Time Slot 02</MenuItem>
              </Select>
            </Grid>

            {/* Address with Select Location Button */}
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={10}>
                  <TextField
                    label="Address"
                    name="address"
                    value={pickupDetails.address}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    error={!!errors.address}
                    helperText={errors.address}
                  />
                </Grid>
                <Grid item xs={12} sm={2} style={{ display: 'flex', alignItems: 'center' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    // onClick={handleSelectLocation} // Assuming you have a handleSelectLocation function
                  >
                    Select Location
                  </Button>
                </Grid>
              </Grid>
            </Grid>

            {/* Contact */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Contact"
                name="contact"
                value={pickupDetails.contact}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                error={!!errors.contact}
                helperText={errors.contact}
              />
            </Grid>

            {/* Driver Name */}
            <Grid item xs={12}>
              <InputLabel id="driverName-label">Driver Name</InputLabel>
              <Select
                labelId="driverName-label"
                name="driverName"
                value={pickupDetails.driverName}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                error={!!errors.driverName}
                helperText={errors.driverName}
              >
                <MenuItem value="driverA">Driver A</MenuItem>
                <MenuItem value="driverB">Driver B</MenuItem>
              </Select>
            </Grid>
          </Grid>
        </Paper>
        <Paper elevation={3} style={{ padding: '20px', margin: '20px' }}>
          <Box display="flex" flexDirection="column" alignItems="left">
            <Typography variant="h4" gutterBottom>
              Quantities Details
            </Typography>
            <br />
            <br />
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6} container alignItems="center">
              <img
                src={plasticsImage}
                alt=""
                style={{ width: '50px', height: '70px', marginRight: '20px', marginLeft: '250px' }}
              />
              <TextField
                name="plasticWeight"
                value={pickupDetails.plasticWeight}
                onChange={handleChange}
                variant="outlined"
                style={{ width: '80px', marginBottom: '20px' }}
                error={!!errors.plasticWeight}
                helperText={errors.plasticWeight}
              />
              <Typography
                variant="body1"
                style={{ marginLeft: '10px', fontWeight: 'bold', fontSize: '16px' }}
              >
                <Typography sx={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '20px' }}>
                  Kg
                </Typography>
              </Typography>
            </Grid>

            <Grid item xs={12} md={6} container alignItems="center">
              <img
                src={clothesImage}
                alt=""
                style={{ width: '50px', height: '70px', marginRight: '20px', marginLeft: '200px' }}
              />
              <TextField
                name="clothesWeight"
                value={pickupDetails.clothesWeight}
                onChange={handleChange}
                variant="outlined"
                style={{ width: '80px', marginBottom: '20px' }}
                error={!!errors.clothesWeight}
                helperText={errors.clothesWeight}
              />
              <Typography
                variant="body2"
                style={{ marginBottom: '20px', fontWeight: 'bold', fontSize: '16px' }}
              >
                <Typography sx={{ fontWeight: 'bold', fontSize: '18px', marginLeft: '10px' }}>
                  Pieces
                </Typography>
              </Typography>
            </Grid>

            <Grid item xs={12} md={6} container alignItems="center">
              <img
                src={papersImage}
                alt=""
                style={{ width: '50px', height: '70px', marginRight: '20px', marginLeft: '250px' }}
              />
              <TextField
                name="paperWeight"
                value={pickupDetails.paperWeight}
                onChange={handleChange}
                variant="outlined"
                style={{ width: '80px', marginBottom: '20px' }}
                error={!!errors.paperWeight}
                helperText={errors.paperWeight}
              />
              <Typography
                variant="body3"
                style={{ marginBottom: '20px', fontWeight: 'bold', fontSize: '16px' }}
              >
                <Typography sx={{ fontWeight: 'bold', fontSize: '18px', marginLeft: '10px' }}>
                  Kg
                </Typography>
              </Typography>
            </Grid>

            <Grid item xs={12} md={6} container alignItems="center">
              <img
                src={booksImage}
                alt=""
                style={{ width: '50px', height: '70px', marginRight: '20px', marginLeft: '200px' }}
              />

              <TextField
                name="bookWeight"
                value={pickupDetails.bookWeight}
                onChange={handleChange}
                variant="outlined"
                style={{ width: '80px', marginBottom: '20px' }}
                error={!!errors.bookWeight}
                helperText={errors.bookWeight}
              />
              <Typography
                variant="body4"
                style={{ marginBottom: '20px', fontWeight: 'bold', fontSize: '16px' }}
              >
                <Typography sx={{ fontWeight: 'bold', fontSize: '18px', marginLeft: '10px' }}>
                  Books
                </Typography>
              </Typography>
            </Grid>

            <Grid item xs={12} md={6} container alignItems="center">
              <img
                src={tinsImage}
                alt=""
                style={{ width: '50px', height: '70px', marginRight: '20px', marginLeft: '250px' }}
              />
              <TextField
                name="tinWeight"
                value={pickupDetails.tinWeight}
                onChange={handleChange}
                variant="outlined"
                style={{ width: '80px', marginBottom: '20px' }}
                error={!!errors.tinWeight}
                helperText={errors.tinWeight}
              />
              <Typography
                variant="body5"
                style={{ marginBottom: '20px', fontWeight: 'bold', fontSize: '16px' }}
              >
                <Typography sx={{ fontWeight: 'bold', fontSize: '18px', marginLeft: '10px' }}>
                  Kg
                </Typography>
              </Typography>
            </Grid>

            <Grid item xs={12} container justifyContent="flex-end" alignItems="center">
              <Box display="flex" gap={2}></Box>
            </Grid>
          </Grid>
        </Paper>

        <Grid item xs={12} marginLeft={'70px'}>
          <FormControlLabel
            control={<Checkbox name="checkbox" />}
            label={
              <Typography style={{ fontWeight: 'bold', marginLeft: '5px' }}>
                Notify via sms those who does not have the user application
              </Typography>
            }
          />
        </Grid>
        <br />
        <Grid container justifyContent="center">
  <Grid item>
    <Button
      variant="contained"
      color="primary"
      // onClick={handleSelectLocation} // Assuming you have a handleSelectLocation function
      style={{ width: '200px' }} // Adjust the width as needed
    >
      Save Pickup
    </Button>
  </Grid>
</Grid>
      </DashboardCard>
    </PageContainer>
  );
};

export default AddPickup;
