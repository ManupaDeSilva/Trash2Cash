import React, { useState } from 'react';
import {
  Typography,
  TextField,
  Button,
  Box,
  Tabs,
  Tab,
  Grid,
  InputAdornment,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { AccountCircle, Email, Phone, Message } from '@mui/icons-material';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import DateRangeIcon from '@mui/icons-material/DateRange';
import axios from 'axios';
import EmailIcon from '@mui/icons-material/Email';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Invites',
  },
];

// Testing credentials
const username = 'root';
const password = 't2c';
// Encode credentials to Base64
const encodedCredentials = btoa(`${username}:${password}`);

const Invites = () => {
  const [success, setSuccess] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [tabIndex, setTabIndex] = useState(0);
  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    expDate: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate expDate
    if (!form.expDate || isNaN(form.expDate) || parseInt(form.expDate) <= 0) {
      newErrors.expDate = 'Exp date must be an integer value above 0';
    }

    // Validate mobile
    const mobilePattern = /^94\d{9}$/;
    if (!mobilePattern.test(form.mobile)) {
      newErrors.mobile = 'Phone number must start with 94 and be followed by 9 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendInvitation = async () => {
    if (validateForm()) {
      // Handle send invitation logic here
      if (form.name == '' || form.email == '' || form.expDate == '' || form.mobile == '') {
        setAlertMsg('Please Fill All Fields');
        setAlertOpen(true);
      } else {
        try {
          const response = await axios.post(
            `http://ec2-18-143-176-53.ap-southeast-1.compute.amazonaws.com:8080/api/invitations/send/${
              tabIndex == 0 ? 'user' : tabIndex == 1 ? 'driver' : 'staff'
            }/${form.expDate}`,
            {
              email: form.email,
              name: form.name,
              mobile: form.mobile,
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
            setAlertMsg(response.data.message);
            setSuccess(true);
          } else {
            setAlertMsg(response.data.message);
            setAlertOpen(true);
          }
        } catch (error) {
          console.error('Error:', error);
          // handle error
        }
      }
      console.log('Invitation sent:', form);
    }
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
    setSuccess(false);
  };

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  const renderTabContent = () => {
    switch (tabIndex) {
      case 0:
        return (
          <Box my={2}>
            <Typography variant="h6">Invite User</Typography>
            <form noValidate autoComplete="off">
              {alertOpen && (
                <Alert severity="error" onClose={handleAlertClose}>
                  {alertMsg}
                </Alert>
              )}
              {success && (
                <Alert severity="info" onClose={handleAlertClose}>
                  {alertMsg}
                </Alert>
              )}
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={4}>
                  <Typography variant="subtitle1">Name</Typography>
                </Grid>
                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    margin="normal"
                    placeholder="John Doe"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccountCircle />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="subtitle1">Email</Typography>
                </Grid>
                <Grid item xs={8}>
        <FormControl fullWidth >
        <InputLabel sx={{color:'grey'}} variant='outlined' id="email-select">Add email/emails</InputLabel>
        <Select
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <EmailIcon></EmailIcon>
            </InputAdornment>
          ),
        }}
          labelId="inviteEmails"
          name="Email"
          //value={}
          onChange={handleChange}
          renderValue={(selected) => {
            if (!selected) {
              return <em>Select Time Slot</em>;
            }
            return selected;
          }}
        >
          <MenuItem value="" disabled>
            Add new email
          </MenuItem>
          <MenuItem value="email1">Alexperera1@example.com</MenuItem>
          <MenuItem value="email2">Alexperera1@example.com</MenuItem>
          <MenuItem value="email4"></MenuItem>
        </Select>
      </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="subtitle1">Phone Number</Typography>
                </Grid>
                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    name="mobile"
                    value={form.mobile}
                    onChange={handleChange}
                    margin="normal"
                    placeholder="9422150451"
                    type="tel"
                    error={!!errors.mobile}
                    helperText={errors.mobile}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="subtitle1">Exp date (From now)</Typography>
                </Grid>
                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    name="expDate"
                    value={form.expDate}
                    onChange={handleChange}
                    margin="normal"
                    type="number"
                    placeholder="14"
                    error={!!errors.expDate}
                    helperText={errors.expDate}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DateRangeIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Button variant="contained" color="primary" onClick={handleSendInvitation}>
                    Send Invitation
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        );
      case 1:
        return (
          <Box my={2}>
            <Typography variant="h6">Invite Driver</Typography>
            <form noValidate autoComplete="off">
              {alertOpen && (
                <Alert severity="error" onClose={handleAlertClose}>
                  {alertMsg}
                </Alert>
              )}
              {success && (
                <Alert severity="info" onClose={handleAlertClose}>
                  {alertMsg}
                </Alert>
              )}
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={4}>
                  <Typography variant="subtitle1">Name</Typography>
                </Grid>
                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    margin="normal"
                    placeholder="John Doe"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccountCircle />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="subtitle1">Email</Typography>
                </Grid>
                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    margin="normal"
                    placeholder="john.doe"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">@example.com</InputAdornment>,
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="subtitle1">Phone Number</Typography>
                </Grid>
                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    name="mobile"
                    value={form.mobile}
                    onChange={handleChange}
                    type="tel"
                    margin="normal"
                    placeholder="9422150451"
                    error={!!errors.mobile}
                    helperText={errors.mobile}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="subtitle1">Exp date (From now)</Typography>
                </Grid>
                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    name="expDate"
                    value={form.expDate}
                    onChange={handleChange}
                    type="number"
                    margin="normal"
                    placeholder="14"
                    error={!!errors.expDate}
                    helperText={errors.expDate}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DateRangeIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Button variant="contained" color="primary" onClick={handleSendInvitation}>
                    Send Invitation
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        );
      case 2:
        return (
          <Box my={2}>
            <Typography variant="h6">Invite Staff</Typography>
            <form noValidate autoComplete="off">
              {alertOpen && (
                <Alert severity="error" onClose={handleAlertClose}>
                  {alertMsg}
                </Alert>
              )}
              {success && (
                <Alert severity="info" onClose={handleAlertClose}>
                  {alertMsg}
                </Alert>
              )}
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={4}>
                  <Typography variant="subtitle1">Name</Typography>
                </Grid>
                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    margin="normal"
                    placeholder="John Doe"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccountCircle />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="subtitle1">Email</Typography>
                </Grid>
                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    margin="normal"
                    placeholder="john.doe"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">@example.com</InputAdornment>,
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="subtitle1">Phone Number</Typography>
                </Grid>
                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    name="mobile"
                    value={form.mobile}
                    type="tel"
                    onChange={handleChange}
                    margin="normal"
                    placeholder="9422150451"
                    error={!!errors.mobile}
                    helperText={errors.mobile}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="subtitle1">Exp date (From now)</Typography>
                </Grid>
                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    name="expDate"
                    value={form.expDate}
                    type="number"
                    onChange={handleChange}
                    margin="normal"
                    placeholder="14"
                    error={!!errors.expDate}
                    helperText={errors.expDate}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DateRangeIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Button variant="contained" color="primary" onClick={handleSendInvitation}>
                    Send Invitation
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <PageContainer>
      <Breadcrumb title="Invites" items={BCrumb} />
      <DashboardCard title="Invites">
        <Tabs value={tabIndex} onChange={handleTabChange}>
          <Tab label="User" />
          <Tab label="Driver" />
          <Tab label="Staff" />
        </Tabs>
        {renderTabContent()}
      </DashboardCard>
    </PageContainer>
  );
};

export default Invites;
