import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Button,
  Modal,
  Box,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Offload Points',
  },
];

const OffloadPoints = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOffloadPoints, setSelectedOffloadPoints] = useState(null);
  const [addressMap, setAddressMap] = useState({});
  const [mobileMap, setMobileMap] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState({ lat: 0, lon: 0 });
  const username = 'root';
  const password = 't2c';
  const apiKey = 'AIzaSyAqiRkh8Sj4hGbLbMiezln6AFIXG-6POFg'; // Replace with your actual API key
  const encodedCredentials = btoa(`${username}:${password}`);

  const fetchOffloadLocations = async () => {
    const response = await axios.get(
      'http://ec2-18-143-176-53.ap-southeast-1.compute.amazonaws.com:8080/api/offload-locations',
      {
        headers: {
          Authorization: `Basic ${encodedCredentials}`,
        },
      },
    );
    return response.data;
  };

  const {
    data: offloadPoints = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['offloadlocData'],
    queryFn: fetchOffloadLocations,
  });

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

  const formatPhoneNumber = (phoneNumber) => {
    phoneNumber = phoneNumber.replace(/^\+?(94)?/, '0');
    return phoneNumber.replace(/(\d{3})(\d{2})(\d{4})/, ' $1 $2 $3');
  };

  useEffect(() => {
    const fetchAddresses = async () => {
      const newAddressMap = {};
      for (const point of offloadPoints) {
        try {
          const address = await fetchAddressFromCoordinates(point.location);
          newAddressMap[point.id] = address;
        } catch (error) {
          newAddressMap[point.id] = 'Error fetching address';
        }
      }
      setAddressMap(newAddressMap);
    };

    if (offloadPoints.length > 0) {
      fetchAddresses();
    }
  }, [offloadPoints]);

  useEffect(() => {
    const fetchAddresses = async () => {
      const newMobileMap = {};
      for (const point of offloadPoints) {
        try {
          const contact = await formatPhoneNumber(point.mobile);
          newMobileMap[point.id] = contact;
        } catch (error) {
          newMobileMap[point.id] = point.mobile;
        }
      }
      setMobileMap(newMobileMap);
    };

    if (offloadPoints.length > 0) {
      fetchAddresses();
    }
  }, [offloadPoints]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleMoreClick = (event, offloadpoints) => {
    setAnchorEl(event.currentTarget);
    setSelectedOffloadPoints(offloadpoints);
  };

  const handleMoreClose = () => {
    setAnchorEl(null);
    setSelectedOffloadPoints(null);
  };

  const handleView = () => {
    navigate(`/view-offloadpoint/${selectedOffloadPoints.id}`, {
      state: { selectedOffloadPoints },
    });
    handleMoreClose();
  };

  const handleAddOffloadpoint = () => {
    navigate('/add-offloadpoint');
  };

  const handleAssign = () => {
    navigate(`/assign-offloadpoint/${selectedOffloadPoints.id}`);
    handleMoreClose();
  };

  const openModal = (location) => {
    const jsonObject = JSON.parse(location);
    const { lat, long: lon } = jsonObject;
    setSelectedLocation({ lat, lon });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  // Function to initialize Google Map with marker
  const initializeMap = () => {
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: { lat: selectedLocation.lat, lng: selectedLocation.lon },
      zoom: 14,
    });

    // Add marker
    new window.google.maps.Marker({
      position: { lat: selectedLocation.lat, lng: selectedLocation.lon },
      map,
      title: 'Selected Location',
    });
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
    if (modalOpen) {
      loadGoogleMaps();
    }
  }, [modalOpen]);

  return (
    <PageContainer title="Offload Points Page" description="This is the Offload Points page">
      <Breadcrumb title="Offload Points" items={BCrumb} />
      <DashboardCard title="Offload Points">
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <TextField
            placeholder="Search..."
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            style={{ flexGrow: 1, marginRight: '16px' }}
            value={searchTerm}
            onChange={handleSearch}
          />
          <Button variant="contained" color="primary" onClick={handleAddOffloadpoint}>
            Add Offload Point
          </Button>
        </div>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {offloadPoints
                .filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((offloadpoint) => (
                  <TableRow key={offloadpoint.id}>
                    <TableCell>{offloadpoint.id}</TableCell>
                    <TableCell>{offloadpoint.name}</TableCell>
                    <TableCell>
                      <Button onClick={() => openModal(offloadpoint.location)}>
                        {addressMap[offloadpoint.id] || 'Fetching address...'}
                      </Button>
                    </TableCell>
                    <TableCell>{mobileMap[offloadpoint.id] || 'Fetching contact...'}</TableCell>
                    <TableCell>
                      <IconButton onClick={(event) => handleMoreClick(event, offloadpoint)}>
                        <MoreVertIcon />
                      </IconButton>
                      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMoreClose}>
                        <MenuItem onClick={() => handleView(offloadpoint.id)}>View</MenuItem>
                        <MenuItem onClick={() => handleAssign()}>Assign</MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DashboardCard>

      <Modal
        open={modalOpen}
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
          <h2 id="location-modal-title">Location Map</h2>
          <div id="map" style={{ width: '100%', height: '90%' }}></div>
          <Button onClick={closeModal}>Close</Button>
        </Box>
      </Modal>
    </PageContainer>
  );
};

export default OffloadPoints;
