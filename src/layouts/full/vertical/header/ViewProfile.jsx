import React, { useEffect, useState } from 'react';
import { Box, Avatar, Typography, Button, Stack, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import ProfileImg from 'src/assets/images/profile/user-1.jpg';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import Cookies from 'js-cookie';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Admin',
  },
];

const ViewProfile = () => {
  const [admindata, setAdminData] = useState("");

  useEffect(() => {
    CheckAdmin();
  }, []);

  const CheckAdmin = () => {
    const creds = Cookies.get('admin');
    if (creds) {
      const parsedData = JSON.parse(decodeURI(creds));

      setAdminData(parsedData);
      console.log(parsedData);

    }
  };

  const handleDeleteProfile = async () => {
    try {
      // Example of deletion API call using fetch
      const response = await fetch('/api/admin/profile', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // Include any necessary authentication headers (token, etc.) here
        },
      });
      
      if (response.ok) {
        // Handle successful deletion, e.g., redirect user or show confirmation
        console.log('Profile deleted successfully');
        // Example: Redirect to homepage after deletion
        // history.push('/');
      } else {
        // Handle errors or failed deletion
        console.error('Failed to delete profile');
      }
    } catch (error) {
      // Handle network errors or any other exceptions
      console.error('Error deleting profile:', error);
    }
  };

  return (
    <PageContainer title="Admin Details" description="This is the Profile page">
      {/* breadcrumb */}
      <Breadcrumb title="Admin Details" items={BCrumb} />
      {/* end breadcrumb */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p={4}
        sx={{ maxWidth: 'calc(100% - 240px)', margin: 'auto', textAlign: 'center' }}
      >
        <Avatar src={'https://t2cimg.shieldtechnologies.xyz/images/chakraSutra.png'} alt="Profile" sx={{ width: 120, height: 120, mb: 2 }} />

        {/* Container Title */}
        <Typography variant="h6" fontWeight={600} mb={2}>
          Admin Information
        </Typography>

        {/* Admin Details */}
        <Box width="100%" textAlign="left" mt={3} p={2} border={1} borderRadius={1} borderColor="grey.300">
          {/* AID and Admin Name side by side */}
          <Box display="flex" flexDirection="row" justifyContent="space-between" mb={2}>
            <Box flex={1} mr={1}>
              <Typography variant="subtitle1" mb={1}>AID</Typography>
              <TextField
                fullWidth
                margin="normal"
                value={admindata.id}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Box>
            <Box flex={1} ml={1}>
              <Typography variant="subtitle1" mb={1}>Admin Name</Typography>
              <TextField
                fullWidth
                margin="normal"
                value={admindata.fname + " " + admindata.lname}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Box>
          </Box>

          {/* Email Address and Phone Number side by side */}
          <Box display="flex" flexDirection="row" justifyContent="space-between" mb={2}>
            <Box flex={1} mr={1}>
              <Typography variant="subtitle1" mb={1}>Email Address</Typography>
              <TextField
                fullWidth
                margin="normal"
                value={admindata.email}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Box>
            <Box flex={1} ml={1}>
              <Typography variant="subtitle1" mb={1}>Phone Number</Typography>
              <TextField
                fullWidth
                margin="normal"
                value={admindata.mobile}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Box>
          </Box>

          {/* Address and City side by side */}
          <Box display="flex" flexDirection="row" justifyContent="space-between" mb={2}>
            <Box flex={1} mr={1}>
              <Typography variant="subtitle1" mb={1}>Address</Typography>
              <TextField
                fullWidth
                margin="normal"
                value={admindata.address_line2}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Box>
            <Box flex={1} ml={1}>
              <Typography variant="subtitle1" mb={1}>City</Typography>
              <TextField
                fullWidth
                margin="normal"
                value={admindata.address_line1}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Box>
          </Box>

          {/* DOB */}
          {/* <Box mb={2}>
            <Typography variant="subtitle1" mb={1}>DOB</Typography>
            <TextField
              fullWidth
              margin="normal"
              value="01/01/1990"
              InputProps={{
                readOnly: true,
              }}
            />
          </Box> */}
        </Box>

        {/* Action Buttons */}
        <Stack direction="row" spacing={2} justifyContent="flex-end" mt={3} width="100%">
          <Button variant="contained" color="primary" component={Link} to="/edit-admin">
            Edit 
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleDeleteProfile}>
            Delete
          </Button>
        </Stack>
      </Box>
    </PageContainer>
  );
};

export default ViewProfile;
