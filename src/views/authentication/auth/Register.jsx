import React, { useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Grid, Box, Typography, Stack, TextField, Button, Checkbox, FormControlLabel } from '@mui/material';

import PageContainer from 'src/components/container/PageContainer';
import img1 from 'src/assets/images/backgrounds/LoginBG.png';
import Logo from 'src/layouts/full/shared/logo/Logo';

import AuthRegister from 'src/views/authentication/authForm/AuthRegister';

const Register = () => (
    <PageContainer title="Register" description="this is Register page">
      <Grid container spacing={0} justifyContent="center" sx={{ overflowX: 'hidden' }}>
        <Grid
          item
          xs={12}
          sm={12}
          lg={6}
          xl={8}
          sx={{
            position: 'relative',
            '&:before': {
              content: '""',
              background: 'radial-gradient(#d2f1df, #d3d7fa, #bad8f4)',
              backgroundSize: '400% 400%',
              animation: 'gradient 15s ease infinite',
              position: 'absolute',
              height: '100%',
              width: '100%',
              opacity: '0.3',
            },
          }}
        >
          <Box position="relative">
            <Box pl={3} pt={3}>
              <Logo />
            </Box>
            <Box
              alignItems="center"
              justifyContent="center"
              height={'calc(100vh - 95px)'}
              sx={{
                display: {
                  xs: 'none',
                  lg: 'flex',
                },
              }}
            >
              <img
                src={img1}
                alt="bg"
                style={{
                  width: '90%', // Adjust the width as needed
                  maxWidth: '350px', // Set a maximum width if necessary
                  marginLeft: '30px', // Adjust the margin to move it to the left
                  marginTop: '30px',
                }}
              />
            </Box>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          lg={6}
          xl={4}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Box p={4} width="80%">
            <AuthRegister
              title="Signup for Trash2Cash Admin Dashboard"
              subtext={
                <Typography variant="subtitle1" color="textSecondary" mb={1}>
                  Your Admin Dashboard
                </Typography>
              }
              subtitle={
                <Stack direction="row" spacing={1} mt={3}>
                  <Typography color="textSecondary" variant="h6" fontWeight="400">
                    Already have an Account?
                  </Typography>
                  <Typography
                    component={Link}
                    to="/auth/login"
                    fontWeight="500"
                    sx={{
                      textDecoration: 'none',
                      color: '#FF8A1F',
                    }}
                  >
                    Login
                  </Typography>
                </Stack>
              }
            />
          </Box>
        </Grid>
      </Grid>
    </PageContainer>
);

export default Register;
