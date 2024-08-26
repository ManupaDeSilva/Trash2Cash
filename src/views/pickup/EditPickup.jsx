import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  TextField, Button, Paper, Typography, Grid, Box, InputAdornment,
  Backdrop,
  Fade,
  Modal
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
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
import dayjs from 'dayjs';

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';

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
    title: 'Edit Pickup',
  },
];

const EditPickup = () => {
  const { pickupID } = useParams();
  const navigate = useNavigate();
  const Location = useLocation();
  const { pickup } = Location.state;
  const [pickupDetails,setPickupDetails] = useState({
    id: "Fetching...",
    customerName: "Fetching...",
    driverName: "Fetching...",
    dateTime: "Fetching...",
    address: "Fetching...",
    timeslots: "Fetching...",
    status: "Fetching...",
  });
  const [itemList, setItemList] = useState({
    pct: '',
    gbottles: '',
    clothes: '',
    books: '',
    papers: ''
  });  
  
  const [mapOpen, setMapOpen] = useState(false);
  const [location, setLocation] = useState(null);

  const [errors, setErrors] = useState({});

  const DefaultIcon = L.icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });
  
  L.Marker.prototype.options.icon = DefaultIcon;
  
  const LocationMarker = ({ setLocation }) => {
    useMapEvents({
        async click(e) {
            const address = await fetchAddressFromCoordinates(JSON.stringify({ lat: e.latlng.lat.toFixed(5), long: e.latlng.lng.toFixed(5) }));
            setPickupDetails({
              ...pickupDetails,
              address: address,
            });
            setLocation(e.latlng);
            console.log()
        },
    });
  
    return null;
  };

  const handleItemChange = (e) => {
    const { name, value } = e.target;
  
    // Remove leading zeros and format value correctly
    const formatValue = (val, isDecimalAllowed) => {
      // Remove leading zeros
      val = val.replace(/^0+(?!$)/, '');
  
      // Allow only one decimal point
      if (isDecimalAllowed) {
        const parts = val.split('.');
        if (parts.length > 2) {
          return parts[0] + '.' + parts.slice(1).join('').replace('.', '');
        } else if (parts.length === 2) {
          return parts[0] + '.' + parts[1].slice(0, 1);
        }
      }
      
      return val;
    };
  
    const isDecimalAllowed = name === 'pct' || name === 'papers' || name === 'gbottles';
  
    if (isDecimalAllowed) {
      if (value === '' || /^[0-9]*\.?[0-9]{0,1}$/.test(value)) {
        setItemList((prev) => ({
          ...prev,
          [name]: formatValue(value, true)
        }));
      }
    } else {
      if (value === '' || /^[0-9]*$/.test(value)) {
        setItemList((prev) => ({
          ...prev,
          [name]: formatValue(value, false)
        }));
      }
    }
  };
  
  const fetchAddressFromCoordinates = async (jsonString) => {
    try {
      const jsonObject = JSON.parse(jsonString);
      const { lat, long: lon } = jsonObject;
  
      if (!lat || !lon) {
        throw new Error('Invalid JSON format. Please provide both lat and long.');
      }
  
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
      const data = await response.json();
  
      if (data && data.display_name) {
        const addressParts = data.display_name.split(', ').slice(0, 4).join(', ');
        return addressParts;
      } else {
        throw new Error('Unable to fetch address');
      }
    } catch (error) {
      throw new Error(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (pickup) {
          const address = await fetchAddressFromCoordinates(pickup.home_point.location);
          const { lat, long } = JSON.parse(pickup.home_point.location)
          setLocation(new L.LatLng(lat, long));
          setItemList(pickup.home_point.itemList)
          setPickupDetails({
            id: pickupID,
            customerName: pickup.home_point.user.name,
            driverName: pickup.driver.name,
            dateTime: formatDate(pickup.home_point.timeslot.date),
            address: address,
            timeslots: `${formatTime(pickup.home_point.timeslot.from)} - ${formatTime(pickup.home_point.timeslot.to)}`,
            status: capitalize(pickup.pickupStatus.status),
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, [pickup, pickupDetails.id]); // Adjust dependencies as needed
  
  const formatDate = (date) => {
    return dayjs(date).format('MM/DD/YYYY');
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

  // these validations are not correct validations only for testing
  const validate = () => {
    let tempErrors = {};
  
    if (pickupDetails.id.trim().length !== 4) {
      tempErrors.pickupID = 'Pickup ID must be 4 characters.';
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
  
    if (pickupDetails.address.trim().length === 0) {
      tempErrors.address = 'Address is required.';
    }
  
    const validateDecimal = (value) => {
      return /^(\d+(\.\d{1})?)?$/.test(value);
    };
  
    if (!validateDecimal(itemList.pct)) {
      tempErrors.pct = 'Plastics must be a valid number with up to 1 decimal place.';
    }
  
    if (!validateDecimal(itemList.gbottles)) {
      tempErrors.gbottles = 'Glass Bottles must be a valid number with up to 1 decimal place.';
    }
  
    if (!validateDecimal(itemList.papers)) {
      tempErrors.papers = 'Papers must be a valid number with up to 1 decimal place.';
    }
  
    const validateInteger = (value) => {
      return /^\d*$/.test(value);
    };
  
    if (!validateInteger(itemList.clothes)) {
      tempErrors.clothes = 'Clothes must be a valid whole number.';
    }
  
    if (!validateInteger(itemList.books)) {
      tempErrors.books = 'Books must be a valid whole number.';
    }
  
    setErrors(tempErrors);
  
    return Object.keys(tempErrors).length === 0;
  };
  

  const handleSave = (e) => {
    e.preventDefault();

    if (!validate()) {
      console.log(errors);
      alert('Please fill out all fields correctly.');
      return;
    }

    console.log('Saved Pickup Details:', pickupDetails);
    navigate('/pickups'); // Redirect to pickups page after saving
  };

  const handleCancel = (e) => {
    e.preventDefault();
    console.log('Cancel Edit Pickup Details:', pickupDetails);
    navigate('/pickups'); // Redirect to pickups page after saving
  };

  return (
    <PageContainer title="Edit Details" description="View Pickup Details">
      <Breadcrumb title="Pickup Details" items={BCrumb} />
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
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Pickup ID"
                name="id"
                value={pickupDetails.id}
                variant="outlined"
                onChange={handleChange}
                fullWidth
                error={!!errors.id}
                helperText={errors.id}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Current Status"
                name="status"
                value={pickupDetails.status}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                error={!!errors.status}
                helperText={errors.status}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Customer Name"
                name="customerName"
                value={pickupDetails.customerName}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                error={!!errors.customerName}
                helperText={errors.customerName}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Driver Name"
                name="driverName"
                value={pickupDetails.driverName}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                error={!!errors.driverName}
                helperText={errors.driverName}
              />
            </Grid>
            <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Scheduled Date"
                name="dateTime"
                value={pickupDetails.dateTime}
                onChange={handleDateChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    variant="outlined"
                    error={!!errors.dateTime}
                    helperText={errors.dateTime}
                    InputProps={{
                      ...params.InputProps,
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
              <TextField
                label="Time Slot"
                name="timeslots"
                value={pickupDetails.timeslots}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                error={!!errors.timeslots}
                helperText={errors.timeslots}
              />
            </Grid>
            <Grid container spacing={2} style={{ marginTop: '20px', marginLeft: '30px' }}>
              <Grid item xs={12}>
                <TextField
                  label="Address"
                  name="address"
                  value={pickupDetails.address}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  error={!!errors.address}
                  helperText={errors.address}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button
                          variant="contained"
                          style={{ paddingLeft: '20px', paddingRight: '20px', paddingTop: '5px', marginRight: '15px' }}
                          color="primary"
                          onClick={() => {
                            setMapOpen(true);
                          }}
                        >
                          Select Location
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
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
            <Box display="flex" alignItems="center" mb={2}>
              <TextField
                label="Plastics"
                name="pct"
                value={itemList.pct}
                onChange={handleItemChange}
                variant="outlined"
                style={{ marginLeft: '10px' }}
                inputProps={{
                  inputMode: 'decimal',
                  pattern: '^[0-9]*\\.?[0-9]{0,1}$',
                }}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={6} container alignItems="center">
            <img
              src={clothesImage}
              alt=""
              style={{ width: '50px', height: '70px', marginRight: '20px', marginLeft: '200px' }}
            />
            <Box display="flex" alignItems="center" mb={2}>
              <TextField
                label="Clothes"
                name="clothes"
                value={itemList.clothes}
                onChange={handleItemChange}
                variant="outlined"
                style={{ marginLeft: '10px' }}
                inputProps={{
                  inputMode: 'numeric',
                  pattern: '^[0-9]*$',
                }}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={6} container alignItems="center">
            <img
              src={papersImage}
              alt=""
              style={{ width: '50px', height: '70px', marginRight: '20px', marginLeft: '250px' }}
            />
            <Box display="flex" alignItems="center" mb={2}>
              <TextField
                label="Papers"
                name="papers"
                value={itemList.papers}
                onChange={handleItemChange}
                variant="outlined"
                style={{ marginLeft: '10px' }}
                inputProps={{
                  inputMode: 'decimal',
                  pattern: '^[0-9]*\\.?[0-9]{0,1}$',
                }}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={6} container alignItems="center">
            <img
              src={booksImage}
              alt=""
              style={{ width: '50px', height: '70px', marginRight: '20px', marginLeft: '200px' }}
            />
            <Box display="flex" alignItems="center" mb={2}>
              <TextField
                label="Books"
                name="books"
                value={itemList.books}
                onChange={handleItemChange}
                variant="outlined"
                style={{ marginLeft: '10px' }}
                inputProps={{
                  inputMode: 'numeric',
                  pattern: '^[0-9]*$',
                }}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={6} container alignItems="center">
            <img
              src={tinsImage}
              alt=""
              style={{ width: '50px', height: '70px', marginRight: '20px', marginLeft: '250px' }}
            />
            <Box display="flex" alignItems="center" mb={2}>
              <TextField
                label="Glass Bottles"
                name="gbottles"
                value={itemList.gbottles}
                onChange={handleItemChange}
                variant="outlined"
                style={{ marginLeft: '10px' }}
                inputProps={{
                  inputMode: 'decimal',
                  pattern: '^[0-9]*\\.?[0-9]{0,1}$',
                }}
              />
            </Box>
          </Grid>
            <Grid item xs={12} container justifyContent="flex-end" alignItems="center">
              <Box display="flex" gap={2}></Box>
            </Grid>
          </Grid>
        </Paper>
        <Grid item xs={12} container justifyContent="flex-end" alignItems="center">
              <Box display="flex" gap={2}>
                <Button
                  variant="contained"
                  style={{
                    fontWeight: 'bold',
                    paddingLeft: '20px',
                    paddingRight: '20px',
                    paddingBottom: '10px',
                  }}
                  sx={{
                    backgroundColor: '#5D87FF',
                    color: '#FFFFFF',
                    '&:hover': {
                      backgroundColor: '#E5DAD7',
                    },
                  }}
                  onClick={handleSave}
                >
                  Save
                </Button>
                <Button
                  variant="contained"
                  style={{ fontWeight: 'bold', marginRight: '20px' }}
                  sx={{
                    backgroundColor: '#FFFFFF',
                    color: '#FA896B',
                    borderColor: '#FA896B',
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    '&:hover': {
                      backgroundColor: '#E5DAD7',
                    },
                  }}
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </Box>
            </Grid>
            
      </DashboardCard>
      <Modal
          open={mapOpen}
          onClose={() => setMapOpen(false)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
              timeout: 500,
          }}
      >
          <Fade in={mapOpen}>
              <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%', height: '80%', bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
                  <MapContainer center={[7.8731, 80.7718]} zoom={7} style={{ height: '100%', width: '100%' }}>
                      <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                      />
                      {location && <Marker position={location} />}
                      <LocationMarker setLocation={setLocation} />
                  </MapContainer>
              </Box>
          </Fade>
      </Modal>
    </PageContainer>
  );
};

export default EditPickup;
