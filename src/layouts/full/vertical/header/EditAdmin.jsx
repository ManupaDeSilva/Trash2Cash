import React, { useEffect, useState } from 'react';
import { Box, Avatar, Typography, Button, Stack, TextField, Alert } from '@mui/material';
import ProfileImg from 'src/assets/images/profile/user-1.jpg';
import PageContainer from 'src/components/container/PageContainer';
import Cookies from 'js-cookie';
import axios from 'axios';

// Testing credentials
const username = 'root';
const password = 't2c';
// Encode credentials to Base64
const encodedCredentials = btoa(`${username}:${password}`);

const EditAdmin = () => {
  const [admindata, setAdminData] = useState({});
  const [fName, setFName] = useState('');
  const [lName, setLName] = useState('');
  const [id, setId] = useState(0);
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [pfpLink, setPfpLink] = useState('');
  const [city, setCity] = useState('');
  const [username, setUsername] = useState('01/01/1990');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [alertOpen, setAlertOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState('');

  const [alertPassOpen, setAlertPassOpen] = useState(false);
  const [isPassSuccess, setIsPassSuccess] = useState(false);
  const [passMessage, setPassMessage] = useState('');

  useEffect(() => {
    CheckAdmin();
  }, []);

  useEffect(() => {
    if (admindata.fname && admindata.lname) {
      setFName(admindata.fname);
      setLName(admindata.lname);
      setId(admindata.id);
      setUsername(admindata.username);
      setEmail(admindata.email);
      setPhoneNumber(admindata.mobile);
      setAddress(admindata.address_line1);
      setCity(admindata.address_line2);
      setPfpLink(admindata.pfp_link);
    }
  }, [admindata]);

  const CheckAdmin = () => {
    const creds = Cookies.get('admin');
    if (creds) {
      setAdminData(JSON.parse(decodeURI(creds)));
    }
  };

  const CheckUsername = async (usernameCheck) => {
    try {
      const response = await axios.post(
        `http://ec2-18-143-176-53.ap-southeast-1.compute.amazonaws.com:8080/api/admins/check/edit/username`,
        null,
        {
          params: {
            id: id,
            username: usernameCheck,
          },
          headers: {
            Authorization: `Basic ${encodedCredentials}`,
          },
        },
      );
      console.log('Response:', response);
      if (!response.data.successful) {
        setIsSuccess(response.data.successful);
        setMessage(response.data.message);
        setAlertOpen(true);
      }
    } catch (err) {
      // console.error('Error checking username:', err);
    }
  };

  const CheckMobile = async (mobileCheck) => {
    try {
      const response = await axios.post(
        `http://ec2-18-143-176-53.ap-southeast-1.compute.amazonaws.com:8080/api/admins/check/edit/mobile`,
        null,
        {
          params: {
            id: id,
            mobile: mobileCheck,
          },
          headers: {
            Authorization: `Basic ${encodedCredentials}`,
          },
        },
      );
      console.log('Response:', response);
      if (!response.data.successful) {
        setIsSuccess(response.data.successful);
        setMessage(response.data.message);
        setAlertOpen(true);
      }
    } catch (err) {
      // console.error('Error checking username:', err);
    }
  };

  const CheckEmail = async (emailCheck) => {
    try {
      const response = await axios.post(
        `http://ec2-18-143-176-53.ap-southeast-1.compute.amazonaws.com:8080/api/admins/check/edit/email`,
        null,
        {
          params: {
            id: id,
            email: emailCheck,
          },
          headers: {
            Authorization: `Basic ${encodedCredentials}`,
          },
        },
      );
      console.log('Response:', response);
      if (!response.data.successful) {
        setIsSuccess(response.data.successful);
        setMessage(response.data.message);
        setAlertOpen(true);
      }
    } catch (err) {
      // console.error('Error checking username:', err);
    }
  };

  const handlePasswordChange = async () => {
    if (confirmPassword.length == 0 || newPassword.length == 0 || currentPassword.length == 0) {
      setIsPassSuccess(false);
      setPassMessage('Please Fill All Fields');
      setAlertPassOpen(true);
    } else if (newPassword != confirmPassword) {
      setIsPassSuccess(false);
      setPassMessage('Passwords Do Not Match');
      setAlertPassOpen(true);
    } else {
      try {
        const response = await axios.put(
          `http://ec2-18-143-176-53.ap-southeast-1.compute.amazonaws.com:8080/api/admins/pass/${id}`,
          null,
          {
            params: {
              password: currentPassword,
              newPassword: newPassword,
            },
            headers: {
              Authorization: `Basic ${encodedCredentials}`,
            },
          },
        );
        console.log('Response:', response);
        if (response.data.successful) {
          const existingOptions = Cookies.get('admin');
          Cookies.set('admin', encodeURI(JSON.stringify(response.data.admin)), existingOptions);
          setIsPassSuccess(response.data.successful);
          setPassMessage(response.data.message);
          setAlertPassOpen(true);
        } else {
          setIsPassSuccess(response.data.successful);
          setPassMessage(response.data.message);
          setAlertPassOpen(true);
        }
      } catch (err) {
        console.error('Error saving admin data:', err);
      }
    }
  };

  const handleSaveChanges = async () => {
    // Split the full name into first name and last name
    console.log(fName, lName, email, phoneNumber, address, city);

    console.log('Saving changes...');
    try {
      const response = await axios.put(
        `http://ec2-18-143-176-53.ap-southeast-1.compute.amazonaws.com:8080/api/admins/${id}`,
        {
          username: username,
          fname: fName,
          lname: lName,
          email: email,
          mobile: phoneNumber,
          address_line1: address,
          address_line2: city,
          pfp_link: pfpLink,
        },
        {
          headers: {
            Authorization: `Basic ${encodedCredentials}`,
          },
        },
      );
      console.log('Response:', response);
      if (response.data.successful) {
        const existingOptions = Cookies.get('admin');
        Cookies.set('admin', encodeURI(JSON.stringify(response.data.admin)), existingOptions);
        setMessage(response.data.message);
        setAlertOpen(true);
        setIsSuccess(response.data.successful);
        setIsSuccess(true);
      } else {
        setMessage(response.data.message);
        setIsSuccess(response.data.successful);
        setAlertOpen(true);
      }
      if (confirmPassword.length > 0 || newPassword.length > 0 || currentPassword.length > 0) {
        handlePasswordChange();
      }
    } catch (err) {
      console.error('Error saving admin data:', err);
    }
  };

  const handleUploadPicture = () => {
    console.log('Uploading profile picture...');
  };

  const handleResetPicture = () => {
    console.log('Resetting profile picture...');
  };

  return (
    <PageContainer title="Edit Admin" description="Edit Admin Profile">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p={4}
        sx={{ maxWidth: 'calc(100% - 240px)', margin: 'auto', textAlign: 'center' }}
      >
        <Typography variant="h6" fontWeight={600} mb={2}>
          Change Profile
        </Typography>

        <Box display="flex" alignItems="center" mb={3} name="Change Profile">
          <Avatar
            src={'https://t2cimg.shieldtechnologies.xyz/images/chakraSutra.png'}
            alt="Profile"
            sx={{ width: 120, height: 120, mr: 2 }}
          />
          <Box>
            <Button variant="outlined" color="primary" component="label">
              Upload
              <input type="file" style={{ display: 'none' }} onChange={handleUploadPicture} />
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleResetPicture}>
              Reset
            </Button>
          </Box>
        </Box>

        <Typography variant="h6" fontWeight={600} mb={2}>
          Edit Admin Information
        </Typography>

        <Box
          width="100%"
          textAlign="left"
          mt={3}
          p={2}
          border={1}
          borderRadius={1}
          borderColor="grey.300"
        >
          {alertOpen && (
            <Alert severity={isSuccess ? 'success' : 'error'} onClose={() => setAlertOpen(false)}>
              {message}
            </Alert>
          )}
          <TextField
            fullWidth
            margin="normal"
            label="Username"
            value={username}
            onInput={(e) => CheckUsername(e.target.value)}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="First Name"
            value={fName}
            onChange={(e) => setFName(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Last Name"
            value={lName}
            onChange={(e) => setLName(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email Address"
            value={email}
            onInput={(e) => CheckEmail(e.target.value)}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Phone Number"
            value={phoneNumber}
            onInput={(e) => CheckMobile(e.target.value)}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </Box>

        <Typography variant="h6" fontWeight={600} mb={2} mt={4}>
          Change Password
        </Typography>
        <Box
          width="100%"
          textAlign="left"
          mt={3}
          p={2}
          border={1}
          borderRadius={1}
          borderColor="grey.300"
        >
          {alertPassOpen && (
            <Alert
              severity={isPassSuccess ? 'success' : 'error'}
              onClose={() => setAlertPassOpen(false)}
            >
              {passMessage}
            </Alert>
          )}
          <TextField
            fullWidth
            margin="normal"
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Box>

        <Stack direction="row" spacing={2} justifyContent="flex-end" mt={3} width="100%">
          <Button variant="contained" color="primary" onClick={handleSaveChanges}>
            Save
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => window.history.back()}>
            Cancel
          </Button>
        </Stack>
      </Box>
    </PageContainer>
  );
};

export default EditAdmin;
