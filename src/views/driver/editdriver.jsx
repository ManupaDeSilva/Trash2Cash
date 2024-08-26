import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Typography,
  TextField,
  Button,
  Container,
  Avatar,
  Box,
  Grid,
  FormControl,
  FormLabel,
} from '@mui/material';
import Breadcrumb from '../../layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import axios from 'axios';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    to: '/driver',
    title: 'Driver',
  },
  {
    title: 'Edit Driver',
  },
];

const EditDriver = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const driver = location.state.driver;

  const [driverDetails, setDriverDetails] = useState(driver);
  const [validationError, setValidationError] = useState(false);

  // Testing credentials
  const username = 'root';
  const password = 't2c';
  // Encode credentials to Base64
  const encodedCredentials = btoa(`${username}:${password}`);

  // const validateFields = () => {
  //   if (
  //     driverDetails.email.trim() === '' ||
  //     driverDetails.mobile.trim() === '' ||
  //     driverDetails.addressline_1.trim() === '' ||
  //     driverDetails.name.trim() === '' ||
  //     driverDetails.addressline_2.trim() === '' ||
  //     driverDetails.dob.trim() === ''
  //   ) {
  //     return false;
  //   }
  //   return true;
  // };

  const handleChange = (field, value) => {
    setDriverDetails((prevDetails) => ({
      ...prevDetails,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `http://ec2-18-143-176-53.ap-southeast-1.compute.amazonaws.com:8080/api/drivers/${driverDetails.driver_id}`,
        {
          name: driverDetails.name,
          email: driverDetails.email,
          mobile: driverDetails.mobile,
          addressline_1: driverDetails.addressline_1,
          addressline_2: driverDetails.addressline_2,
          pfp_link: 'images/chakraSutra.png',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_online: new Date().toISOString(),
          driverStatus: {
            id: 2,
            status: 'online',
          },
          notifToken: 'test',
        },
        {
          headers: {
            Authorization: `Basic ${encodedCredentials}`,
          },
        },
      );

      navigate('/driver');
    } catch (err) {
      console.error(`Error Edit User : ${driverDetails.driver_id}`, err);
    }

    // navigate('/driver', { state: { driver: driverDetails } });
  };

  const handleCancel = () => {
    navigate('/driver', { state: { driver: driverDetails } });
  };

  return (
    <PageContainer title="Edit Driver Details" description="This is the edit driver profile page">
      <Breadcrumb title="Edit Driver Details" items={BCrumb} />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <DashboardCard title="" sx={{ border: 1, borderColor: 'black.300', padding: 2 }}>
            <Container>
              <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                <Avatar
                  alt="Driver Profile Picture"
                  src="/path/to/default/profile-pic.jpg"
                  sx={{ width: 100, height: 100 }}
                />
              </Box>
              <Typography variant="h6" gutterBottom>
                Personal Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="dense">
                    <FormLabel>Driver ID</FormLabel>
                    <TextField
                      value={driverDetails.driver_id}
                      variant="outlined"
                      disabled
                      onChange={(e) => handleChange('driver_id', e.target.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="dense">
                    <FormLabel>Username</FormLabel>
                    <TextField
                      value={driverDetails.name}
                      variant="outlined"
                      onChange={(e) => handleChange('name', e.target.value)}
                      error={validationError && driverDetails.username.trim() === ''}
                      helperText={
                        validationError && driverDetails.username.trim() === ''
                          ? 'Username is required'
                          : ''
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="dense">
                    <FormLabel>Email</FormLabel>
                    <TextField
                      value={driverDetails.email}
                      variant="outlined"
                      onChange={(e) => handleChange('email', e.target.value)}
                      error={validationError && driverDetails.email.trim() === ''}
                      helperText={
                        validationError && driverDetails.email.trim() === ''
                          ? 'Email is required'
                          : ''
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="dense">
                    <FormLabel>Phone Number</FormLabel>
                    <TextField
                      value={driverDetails.mobile}
                      variant="outlined"
                      onChange={(e) => handleChange('mobile', e.target.value)}
                      error={validationError && driverDetails.contact.trim() === ''}
                      helperText={
                        validationError && driverDetails.contact.trim() === ''
                          ? 'Phone number is required'
                          : ''
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="dense">
                    <FormLabel>Address</FormLabel>
                    <TextField
                      value={driverDetails.addressline_1}
                      variant="outlined"
                      onChange={(e) => handleChange('addressline_1', e.target.value)}
                      error={validationError && driverDetails.address.trim() === ''}
                      helperText={
                        validationError && driverDetails.address.trim() === ''
                          ? 'Address is required'
                          : ''
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="dense">
                    <FormLabel>City</FormLabel>
                    <TextField
                      value={driverDetails.addressline_2}
                      variant="outlined"
                      onChange={(e) => handleChange('addressline_2', e.target.value)}
                      error={validationError && driverDetails.city.trim() === ''}
                      helperText={
                        validationError && driverDetails.city.trim() === ''
                          ? 'City is required'
                          : ''
                      }
                    />
                  </FormControl>
                </Grid>
                {/* <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="dense">
                    <FormLabel>Date of Birth</FormLabel>
                    <TextField
                      value={driverDetails.dob}
                      variant="outlined"
                      onChange={(e) => handleChange('dob', e.target.value)}
                      error={validationError && driverDetails.dob.trim() === ''}
                      helperText={validationError && driverDetails.dob.trim() === '' ? 'Date of Birth is required' : ''}
                    />
                  </FormControl>
                </Grid> */}
                <Grid
                  item
                  xs={12}
                  sm={6}
                  container
                  alignItems="center"
                  justifyContent="flex-end"
                  spacing={1}
                >
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ minWidth: '120px', height: '36px' }}
                      onClick={handleSave}
                    >
                      Save
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      sx={{
                        minWidth: '120px',
                        height: '36px',
                        backgroundColor: 'white',
                        color: 'red',
                        borderColor: 'red',
                        borderWidth: 1,
                        borderStyle: 'solid',
                        '&:hover': {
                          backgroundColor: 'lightgray',
                        },
                      }}
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Container>
          </DashboardCard>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default EditDriver;
