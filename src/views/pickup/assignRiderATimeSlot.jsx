import React, { useState, useEffect } from 'react';
import { Grid, TextField, Button, CircularProgress } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Breadcrumb from '../../layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import assignImage from '../../assets/images/others/assignRider.png';

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
    title: 'Assign rider',
  },
];

// Testing credentials
const username = 'root';
const password = 't2c';
// Encode credentials to Base64
const encodedCredentials = btoa(`${username}:${password}`);

const AssignRiderByTimeSlots = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [drivers, setDrivers] = useState([]);
  const [homePoints, setHomePoints] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedHpId, setSelectedHpId] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isDriverIdDisabled, setIsDriverIdDisabled] = useState(false);
  const [isHpIdDisabled, setIsHpIdDisabled] = useState(false);

  useEffect(() => {
    fetchDrivers();
    fetchHomePoints();
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const driverId = queryParams.get('driver_id');
    const hp_id = queryParams.get('hp_id');

    if (drivers.length > 0 && driverId) {
      selectDriverById(driverId);
      setIsDriverIdDisabled(true);
    }
    if (homePoints.length > 0 && hp_id) {
      selectHpIdById(hp_id);
      setIsHpIdDisabled(true);
    }
  }, [location.search, drivers, homePoints]);

  const fetchDrivers = async () => {
    try {
      const response = await axios.get(
        'http://ec2-18-143-176-53.ap-southeast-1.compute.amazonaws.com:8080/api/drivers',
        {
          headers: {
            Authorization: `Basic ${encodedCredentials}`,
          },
        },
      );
      setDrivers(response.data);
    } catch (error) {
      console.error('Error fetching drivers:', error);
    }
  };

  const fetchHomePoints = async () => {
    try {
      const response = await axios.get(
        'http://ec2-18-143-176-53.ap-southeast-1.compute.amazonaws.com:8080/api/home-points/unscheduled',
        {
          headers: {
            Authorization: `Basic ${encodedCredentials}`,
          },
        },
      );
      setHomePoints(response.data);
    } catch (error) {
      console.error('Error fetching home points:', error);
    }
  };

  const selectDriverById = (driverId) => {
    const driver = drivers.find((d) => d.driver_id === parseInt(driverId, 10));
    if (driver) {
      setSelectedDriver(driver);
    }
  };

  const selectHpIdById = (hp_id) => {
    const homePoint = homePoints.find((hp) => hp.hp_id === parseInt(hp_id, 10));
    if (homePoint) {
      setSelectedHpId(homePoint);
    }
  };

  const handleDriverChange = (event, newValue) => {
    setSelectedDriver(newValue);
  };

  const handleHpIdChange = (event, newValue) => {
    setSelectedHpId(newValue);
  };

  const validateForm = () => {
    let errors = {};
    if (!selectedDriver) {
      errors.driver = 'Driver is required';
    }
    if (!selectedHpId) {
      errors.hp_id = 'PID is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAssign = async () => {
    if (!validateForm()) {
      return;
    }
    const data = {
      hp_id: selectedHpId.hp_id,
      driverId: selectedDriver.driver_id,
    };
    console.log(data);
    setLoading(true);
    try {
      const response = await axios.post(
        'http://ec2-18-143-176-53.ap-southeast-1.compute.amazonaws.com:8080/api/pickups/confirmed',
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${encodedCredentials}`,
          },
        },
      );
      console.log('Response:', response.data);
      setLoading(false);
      // navigate('/offloadpoints');
    } catch (error) {
      console.error('Error submitting form:', error);
      setLoading(false);
    }
  };

  return (
    <PageContainer
      title="Pickup Page"
      description="this is the pickup page"
      style={{ color: '#116378' }}
    >
      <Breadcrumb title="Assign Pickup" items={BCrumb} />
      <DashboardCard title="">
        <img
          src={assignImage}
          alt=""
          style={{ width: '550px', height: '300px', marginRight: '20px', marginLeft: '200px' }}
        />
        <Grid container spacing={4} alignItems="center">
        <Grid item xs={4}>
        Assign Time Slot:
          </Grid>
          <Grid item xs={6}>
            <TextField variant="outlined" fullWidth />
          </Grid>
          <Grid item xs={4}>
            Assign Driver:
          </Grid>
          <Grid item xs={6}>
            <Autocomplete
              options={homePoints}
              getOptionLabel={(option) =>
                `(PID:${option.hp_id}), User:${option.user.name}, ${option.timeslot.date}`
              }
              value={selectedHpId}
              onChange={handleHpIdChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  error={!!formErrors.hp_id}
                  helperText={formErrors.hp_id}
                  disabled={isHpIdDisabled}
                />
              )}
              disabled={isHpIdDisabled}
            />
          </Grid>
          <Grid item xs={4}>
            Offload Point:
          </Grid>
          <Grid item xs={6}>
            <Autocomplete
              options={drivers}
              getOptionLabel={(option) => `(ID:${option.driver_id}) ${option.name}`}
              value={selectedDriver}
              onChange={handleDriverChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  error={!!formErrors.driver}
                  helperText={formErrors.driver}
                  disabled={isDriverIdDisabled}
                />
              )}
              disabled={isDriverIdDisabled}
            />
          </Grid>
          <Grid item xs={4}>
            Supporter (Optional):
          </Grid>
          <Grid item xs={6}>
            <TextField variant="outlined" fullWidth />
          </Grid>
          <Grid item xs={12} style={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              style={{ fontWeight: 'bold' }}
              sx={{
                backgroundColor: '#116378',
                color: '#FFFFFF',
                '&:hover': {
                  backgroundColor: '#116378',
                },
              }}
              onClick={handleAssign}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Assign'}
            </Button>
          </Grid>
        </Grid>
      </DashboardCard>
    </PageContainer>
  );
};

export default AssignRiderByTimeSlots;
