import React, { useState } from 'react';
import {
  Typography,
  Grid,
  Button,
  Modal,
  Fade,
  Backdrop,
  Box,
  Checkbox,
  TextField,
  InputAdornment,
} from '@mui/material';
import DashboardCard from '../../components/shared/DashboardCard';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import HomeIcon from '@mui/icons-material/Home';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import plasticsImage from '../../assets/images/others/plastic.svg';
import tinsImage from '../../assets/images/others/tin.svg';
import clothesImage from '../../assets/images/others/clothes.svg';
import booksImage from '../../assets/images/others/books.svg';
import papersImage from '../../assets/images/others/paper.svg';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    to: '/offloadpoints',
    title: 'Offload Points',
  },
  {
    title: 'Add Offload Point',
  },
];

const DefaultIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const LocationMarker = ({ setLocation, setAddress }) => {
  useMapEvents({
    click(e) {
      console.log(e.latlng);
      setLocation(e.latlng);
      fetchAddress(e.latlng.lat, e.latlng.lng, setAddress);
    },
  });

  return null;
};

const fetchAddress = async (lat, lng, setAddress) => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
    );
    const address = response.data.display_name.split(', ').slice(0, 4).join(', ');
    setAddress(address);
  } catch (error) {
    console.error('Error fetching address:', error);
    setAddress('Unable to fetch address');
  }
};

const AddPoint = () => {
  // Testing credentials
  const username = 'root';
  const password = 't2c';
  // Encode credentials to Base64
  const encodedCredentials = btoa(`${username}:${password}`);

  const [form, setForm] = useState({
    name: '',
    phoneNumber: '',
    address: '',
  });

  const [formErrors, setFormErrors] = useState({
    name: '',
    phoneNumber: '',
    address: '',
  });

  const [mapOpen, setMapOpen] = useState(false);
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');

  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  // Function to validate and format mobile number
  const validateAndFormatMobile = (number) => {
    if (number.startsWith('0')) {
      number = '94' + number.substring(1);
    }
    if (number.startsWith('94') && number.charAt(2) === '0') {
      number = '94' + number.substring(3);
    }
    return number;
  };

  // Validate form fields
  const validateForm = () => {
    let errors = {
      name: '',
      phoneNumber: '',
      address: '',
    };

    if (form.name.trim() === '') {
      errors.name = 'Name is required';
    }

    if (!/^\d{10}$/.test(form.phoneNumber)) {
      errors.phoneNumber = 'Phone number should be 10 digits';
    }

    if (!location) {
      errors.address = 'Address is required';
    }

    setFormErrors(errors);

    // Check if there are no errors
    return Object.values(errors).every((error) => error === '');
  };

  // Handle adding a new driver
  const handleAddOffloadPoint = async () => {
    let formattedMobile = validateAndFormatMobile(form.phoneNumber);
    try {
      if (validateForm()) {
        const response = await axios.post(
          `http://ec2-18-143-176-53.ap-southeast-1.compute.amazonaws.com:8080/api/offload-locations`,
          {
            name: form.name,
            location: JSON.stringify({
              lat: parseFloat(parseFloat(location.lat).toFixed(5)),
              long: parseFloat(parseFloat(location.lng).toFixed(5)),
            }),
            mobile: formattedMobile,
          },
          {
            headers: {
              Authorization: `Basic ${encodedCredentials}`,
            },
          },
        );
        if (response.status === 200) {
          console.log(response.data);
          navigate('/offloadpoints');
        }
      }
    } catch (err) {
      console.log('Error Adding Driver:', err);
    }
  };

  return (
    <PageContainer title="Add Offload Point" description="Add a Offload Point page">
      {/* breadcrumb */}
      <Breadcrumb title="Add Offload Point" items={BCrumb} />
      {/* end breadcrumb */}

      <DashboardCard title="Add New Offload Point">
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={4}>
            <Typography variant="subtitle1">Offload Point Name</Typography>
          </Grid>
          <Grid item xs={8}>
            <TextField
              fullWidth
              name="name"
              value={form.name}
              onChange={handleChange}
              margin="normal"
              placeholder="Offload Point Name"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOnIcon />
                  </InputAdornment>
                ),
              }}
              error={!!formErrors.name}
              helperText={formErrors.name}
            />
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle1">Phone Number</Typography>
          </Grid>
          <Grid item xs={8}>
            <TextField
              fullWidth
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              margin="normal"
              placeholder="0712345678"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon />
                  </InputAdornment>
                ),
              }}
              error={!!formErrors.phoneNumber}
              helperText={formErrors.phoneNumber}
            />
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle1">Address</Typography>
          </Grid>
          <Grid item xs={8}>
            <Button variant="contained" color="primary" onClick={() => setMapOpen(true)}>
              Select Location
            </Button>
            {address && (
              <Typography variant="body2" mt={2}>
                Selected Location: {address}
              </Typography>
            )}
            {formErrors.address && (
              <Typography color="error" variant="body2">
                {formErrors.address}
              </Typography>
            )}
          </Grid>
        </Grid>
        <br></br>
        <Typography variant='h6'>Offload Items</Typography>
        <Typography variant='subtitle1'>Please select Offload Items</Typography>
        <Grid
            display="flex"
            justifyContent="center"
            alignItems="center"
            position="relative"
            style={{ marginTop: '50px', marginBottom: '50px' }}
            container spacing={0} sx={{ mt: 5 }} gap={'50px'}>
            <Box>
                <img
                    src={plasticsImage}
                    alt=""
                    style={{ width: '50px', height: '70px', }}
                  />
                <br></br>
                <Checkbox/>
            </Box>
            <Box>
                <img
                    src={clothesImage}
                    alt=""
                    style={{ width: '50px', height: '70px', }}
                  />
                  <br></br>
                  <Checkbox/>
            </Box>
            <Box>
                <img
                    src={papersImage}
                    alt=""
                    style={{ width: '50px', height: '70px', }}
                  />
                  <br></br>
                  <Checkbox/>
            </Box>
            <Box>  
                <img
                    src={booksImage}
                    alt=""
                    style={{ width: '50px', height: '70px',  }}
                  />
                  <br></br>
                  <Checkbox/>
            </Box>
            <Box>
                <img
                    src={tinsImage}
                    alt=""
                    style={{ width: '50px', height: '70px', }}
                  />
                  <br></br>
                  <Checkbox/>
            </Box>
         </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
          <Button variant="contained" color="primary" onClick={handleAddOffloadPoint}>
            Submit
          </Button>
        </Box>
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
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '80%',
              height: '80%',
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
            }}
          >
            <MapContainer
              center={[7.8731, 80.7718]}
              zoom={7}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              {location && <Marker position={location} />}
              <LocationMarker setLocation={setLocation} setAddress={setAddress} />
            </MapContainer>
          </Box>
        </Fade>
      </Modal>
    </PageContainer>
  );
};

export default AddPoint;
