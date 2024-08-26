import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Button,
  Stack,
  Divider,
  Alert,
} from '@mui/material';
import Cookies from 'js-cookie';
import { Link, useNavigate } from 'react-router-dom';

import CustomCheckbox from '../../../components/forms/theme-elements/CustomCheckbox';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';

// Testing credentials
const username = 'root';
const password = 't2c';
// Encode credentials to Base64
const encodedCredentials = btoa(`${username}:${password}`);

// import AuthSocialButtons from './AuthSocialButtons';

const AuthLogin = ({ title, subtitle, subtext }) => {
  const navigate = useNavigate();
  const [alertOpen, setAlertOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberDevice, setRememberDevice] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Check if the 'rememberDevice' cookie is set and retrieve 'username' cookie
    const rememberDeviceCookie = Cookies.get('rememberDevice');
    if (rememberDeviceCookie) {
      navigate(`/home`);
    } else {
      setRememberDevice(false);
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `http://ec2-18-143-176-53.ap-southeast-1.compute.amazonaws.com:8080/api/admins/login`,
        {
          username: username.trim(),
          password: password,
        },
        {
          headers: {
            Authorization: `Basic ${encodedCredentials}`,
            'Content-Type': 'application/json',
          },
        },
      );
      console.log('Response:', response.data);
      if (response.data.successful) {
        Cookies.set('admin', encodeURI(JSON.stringify(response.data.admin)), { expires: 365 });
        if (rememberDevice) {
          Cookies.set('rememberDevice', rememberDevice, { expires: 365 });
        }
        navigate(`/home`);
      } else {
        setMessage(response.data.message);
        setAlertOpen(true);
      }
      // handle successful login
    } catch (error) {
      console.error('Error:', error);
      // handle error
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {title ? (
        <Typography fontWeight="700" variant="h3" mb={1}>
          {title}
        </Typography>
      ) : null}

      {subtext}

      {/* <AuthSocialButtons title="Sign in with" />
      <Box mt={3}>
        <Divider>
          <Typography
            component="span"
            color="textSecondary"
            variant="h6"
            fontWeight="400"
            position="relative"
            px={2}
          >
            or sign in with
          </Typography>
        </Divider>
      </Box> */}
      {alertOpen && (
        <Alert severity="error" onClose={() => setAlertOpen(false)}>
          {message}
        </Alert>
      )}
      <Stack>
        <Box>
          <CustomFormLabel htmlFor="username">Username</CustomFormLabel>
          <CustomTextField
            id="username"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Box>
        <Box>
          <CustomFormLabel htmlFor="password">Password</CustomFormLabel>
          <CustomTextField
            id="password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Box>
        <Stack justifyContent="space-between" direction="row" alignItems="center" my={2}>
          <FormGroup>
            <FormControlLabel
              control={
                <CustomCheckbox
                  checked={rememberDevice}
                  onChange={(e) => setRememberDevice(e.target.checked)}
                />
              }
              label="Remember this Device"
            />
          </FormGroup>
          <Typography
            component={Link}
            to="/auth/forgot-password"
            fontWeight="500"
            sx={{
              textDecoration: 'none',
              color: '#FF8A1F',
            }}
          >
            Forgot Password ?
          </Typography>
        </Stack>
      </Stack>
      <Box>
        <Button color="primary" variant="contained" size="large" fullWidth type="submit">
          Sign In
        </Button>
      </Box>
      {/* {subtitle} */}
    </form>
  );
};

export default AuthLogin;
