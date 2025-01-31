import React from 'react';
import { Box, Typography, Button, Divider, Checkbox, FormControlLabel } from '@mui/material';
import { Link } from 'react-router-dom';

import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';
import { Stack } from '@mui/system';
import AuthSocialButtons from './AuthSocialButtons';

const AuthRegister = ({ title, subtitle, subtext }) => (
  <>
    {title ? (
      <Typography fontWeight="700" variant="h3" mb={1}>
        {title}
      </Typography>
    ) : null}

    {subtext}
    
    <AuthSocialButtons title="Sign up with" />

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
          or sign up with
        </Typography>
      </Divider>
    </Box>

    <Box>
      <Stack mb={3}>
        <CustomFormLabel htmlFor="name">User Name</CustomFormLabel>
        <CustomTextField id="name" variant="outlined" fullWidth />
        <CustomFormLabel htmlFor="email">Email Address</CustomFormLabel>
        <CustomTextField id="email" variant="outlined" fullWidth />
        <CustomFormLabel htmlFor="password">Password</CustomFormLabel>
        <CustomTextField id="password" variant="outlined" fullWidth />
        <FormControlLabel
          control={<Checkbox name="terms" color="primary" />}
          label="I agree to the terms and conditions"
          sx={{ mt: 2 }}
        />
      </Stack>
      
      <Button
        color="primary"
        variant="contained"
        size="large"
        fullWidth
        component={Link}
        to="/auth/login"
      >
        Sign Up
      </Button>
    </Box>
    {subtitle}
  </>
);

export default AuthRegister;
