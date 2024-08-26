import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Box,
  InputAdornment,
  Modal,
} from '@mui/material';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from 'src/components/shared/DashboardCard';
import truckImage from '../../assets/images/others/truck.png';
import plasticsImage from '../../assets/images/others/plastic.svg';
import tinsImage from '../../assets/images/others/tin.svg';
import clothesImage from '../../assets/images/others/clothes.svg';
import booksImage from '../../assets/images/others/books.svg';
import papersImage from '../../assets/images/others/paper.svg';
import dayjs from 'dayjs';

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
    title: 'Pickup',
  },
];

const CompletePickup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pickup } = location.state;
  const { pickupID } = useParams();
  const [pickupDetails, setPickupDetails] = useState({
    id: 'Fetching...',
    customerName: 'Fetching...',
    driverName: 'Fetching...',
    dateTime: 'Fetching...',
    address: 'Fetching...',
    location: null,
    pickupDateTime: 'Fetching...',
    contact: 'Fetching...',
  });
  const [mapOpen, setMapOpen] = useState(false);
  const apiKey = 'AIzaSyAqiRkh8Sj4hGbLbMiezln6AFIXG-6POFg'; // Replace with your actual API key

  useEffect(async () => {
    if (pickup) {
      setPickupDetails({
        id: pickupID,
        customerName: pickup.home_point.user.name,
        driverName: pickup.driver.name,
        dateTime: formatDate(pickup.pickup_time),
        address: await fetchAddressFromCoordinates(pickup.home_point.location),
        location: pickup.home_point.location,
        pickupDateTime: formatDate(pickup.pickup_time),
        contact: formatPhoneNumber(pickup.home_point.user.mobile),
      });
    }
  }, [pickup]);

  const formatDate = (date) => {
    return dayjs(date).format('MM/DD/YYYY hh:mm A');
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

  const openModal = () => {
    if (pickupDetails.location != null) {
      setMapOpen(true);
    }
  };

  const closeModal = () => {
    setMapOpen(false);
  };

  // Function to initialize Google Map with marker
  const initializeMap = () => {
    if (pickupDetails.location != null) {
      const jsonObject = JSON.parse(pickupDetails.location);
      const { lat, long: lon } = jsonObject;

      const map = new window.google.maps.Map(document.getElementById('map'), {
        center: { lat: lat, lng: lon },
        zoom: 14,
      });

      // Add marker
      new window.google.maps.Marker({
        position: { lat: lat, lng: lon },
        map,
        title: 'PickUp Location',
      });
    }
  };

  // Load Google Maps API script dynamically
  const loadGoogleMaps = () => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initializeMap`;
    script.defer = true;
    script.async = true;
    window.initializeMap = initializeMap;
    document.body.appendChild(script);
  };

  useEffect(() => {
    if (mapOpen) {
      loadGoogleMaps();
    }
  }, [mapOpen]);

  const formatPhoneNumber = (phoneNumber) => {
    // Remove leading '+' or '94'
    phoneNumber = phoneNumber.replace(/^\+?(94)?/, '0');

    // Format with spaces
    return phoneNumber.replace(/(\d{3})(\d{2})(\d{4})/, ' $1 $2 $3');
  };

  const handleEdit = () => {
    navigate(`/edit-pickup/${pickupID}`);
  };

  const handleDelete = () => {
    navigate(`/delete-pickup/${pickupID}`);
  };

  const handleAssignRIider = () => {
    navigate(`/delete-pickup/${pickupID}`);
  };

  return (
    <PageContainer title="Pickup Details" description="View Pickup Details">
      {/* breadcrumb */}
      <Breadcrumb title="Pickup History" items={BCrumb} />
      {/* end breadcrumb */}
      <DashboardCard title="">
        <Box display="flex" flexDirection="column" alignItems="center">
          <img src={truckImage} alt="" style={{ width: '337px', height: '188px' }} />
        </Box>
        <Paper elevation={3} style={{ padding: '20px', margin: '20px' }}>
          <Box display="flex" flexDirection="column" alignItems="left">
            <Typography sx={{ color: '#116378' }} variant="h4" gutterBottom>
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
                label="Driver Name"
                value={pickupDetails.driverName}
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
                value={pickupDetails.dateTime}
                variant="outlined"
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid container spacing={2} style={{ marginTop: '20px', marginLeft: '30px' }}>
              <Grid item xs={12} md={10.5}>
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
              <Grid item xs={12} md={1.5}>
                <Button
                  fullWidth={true}
                  variant="contained"
                  color="primary"
                  sx={{ width: '120px', height: '45px' }}
                  onClick={() => openModal(true)}
                >
                  View On Map
                </Button>
              </Grid>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Contact"
                value={pickupDetails.contact}
                variant="outlined"
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Pick up Date & Time"
                value={pickupDetails.dateTime} // need to change this
                variant="outlined"
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Offloaded Point"
                value={pickupDetails.contact} // need to change this
                variant="outlined"
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Supporter for Driver(Optional)"
                value={pickupDetails.name} // need to change this
                variant="outlined"
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />
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
                {pickup.itemList.gbottles} Kg
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
                {pickup.itemList.clothes} Pieces
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
                {pickup.itemList.papers} Kg
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
                {pickup.itemList.books} Books
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
                {pickup.itemList.pct} Kg
              </Typography>
            </Grid>

            <Grid item xs={12} container justifyContent="flex-end" alignItems="center">
              <Box display="flex" gap={2}></Box>
            </Grid>
          </Grid>
        </Paper>
      </DashboardCard>
      <Modal
        open={mapOpen}
        onClose={closeModal}
        aria-labelledby="location-modal-title"
        aria-describedby="location-modal-description"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            height: '80%',
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2 id="location-modal-title">PickUp Location</h2>
          <div id="map" style={{ width: '100%', height: '90%' }}></div>
          <Button onClick={closeModal}>Close</Button>
        </Box>
      </Modal>
    </PageContainer>
  );
};

export default CompletePickup;
