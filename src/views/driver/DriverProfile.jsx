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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tabs,
  Tab,
  Card,
  CardContent,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  IconButton,
  Paper,
  Checkbox,
  Divider,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
} from 'recharts';
import Breadcrumb from '../../layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import { Search, Poll, AccountCircle, Delete, FilterAlt } from '@mui/icons-material';
import PropTypes from 'prop-types';
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
    title: 'Driver Details',
  },
];

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const DriverProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const driver = location.state.driver;

  const [driverDetails, setDriverDetails] = useState(driver);
  const [editMode, setEditMode] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [selectedMainTab, setSelectedMainTab] = useState(0);
  const [selectedSubTab, setSelectedSubTab] = useState(0);

  const handleMainTabChange = (event, newValue) => {
    setSelectedMainTab(newValue);
  };

  const handleSubTabChange = (event, newValue) => {
    setSelectedSubTab(newValue);
  };

  const Adata = [
    { id: 'BID001', name: 'Sunil Perera', date: '02/01/2024', address: 'No 156/2 Piliyandala' },
    { id: 'BID002', name: 'Susil Perera', date: '02/01/2024', address: 'No 156/2 Piliyandala' },
    { id: 'BID003', name: 'Nimal Perera', date: '02/01/2024', address: 'No 156/2 Piliyandala' },
    { id: 'BID004', name: 'Amal Perera', date: '02/01/2024', address: 'No 156/2 Piliyandala' },
    { id: 'BID005', name: 'Kamal Perera', date: '02/01/2024', address: 'No 156/2 Piliyandala' },
  ];

  // Validation state
  const [validationError, setValidationError] = useState(false);

  //credentials for testing
  const username = 'root';
  const imagePath = 'https://t2cimg.shieldtechnologies.xyz';
  const password = 't2c';

  // Encode credentials to Base64
  const encodedCredentials = btoa(`${username}:${password}`);

  const handleEditToggle = () => {
    navigate('/driver/edit', { state: { driver: driverDetails } });
  };

  const formatPhoneNumber = (phoneNumber) => {
    phoneNumber = phoneNumber.replace(/^\+?(94)?/, '0');
    return phoneNumber.replace(/(\d{3})(\d{2})(\d{4})/, ' $1 $2 $3');
  };

  const validateFields = () => {
    if (
      driverDetails.email.trim() === '' ||
      driverDetails.contact.trim() === '' ||
      driverDetails.address.trim() === ''
    ) {
      return false;
    }
    return true;
  };

  const handleChange = (field, value) => {
    if (editMode) {
      setDriverDetails((prevDetails) => ({
        ...prevDetails,
        [field]: value,
      }));
    }
  };

  const handleDeleteDialogOpen = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  const handleSuccessDialogClose = () => {
    navigate('/driver');
  };

  const handleDeleteDriver = async () => {
    try {
      await axios.delete(
        `http://ec2-18-143-176-53.ap-southeast-1.compute.amazonaws.com:8080/api/drivers/${driverDetails.driver_id}`,
        {
          headers: {
            Authorization: `Basic ${encodedCredentials}`,
          },
        },
      );

      setSuccessDialogOpen(false);
      setDeleteDialogOpen(false);

      setSuccessDialogOpen(true);

      navigate('/driver');
    } catch (err) {
      console.error(`Error Delete User : ${driverDetails.driver_id}`, err);
    }
  };

  const handleDeactivateDialogOpen = () => {
    setDeactivateDialogOpen(true);
  };

  const handleDeactivateDialogClose = () => {
    setDeactivateDialogOpen(false);
  };

  const hadlePickupHistory =()=>{
navigate('/driver-history')
  };

  const handleDeactivateDriver = async () => {
    console.log('Driver deactivated:', driverDetails);
    setDeactivateDialogOpen(false);

    try {
      await axios.delete(
        `http://ec2-18-143-176-53.ap-southeast-1.compute.amazonaws.com:8080/api/drivers/${driverDetails.driver_id}`,
        {
          headers: {
            Authorization: `Basic ${encodedCredentials}`,
          },
        },
      );
    } catch (err) {
      console.error(`Error Delete User : ${driverDetails.driver_id}`, err);
    }
  };

  const buttonStyle = { minWidth: '120px', height: '36px' };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const data = [
    { date: 'Mon', value: 10 },
    { date: 'Tue', value: 20 },
    { date: 'Wed', value: 15 },
    { date: 'Thu', value: 30 },
    { date: 'Fri', value: 25 },
    { date: 'Sat', value: 5 },
    { date: 'Sun', value: 40 },
  ];

  const defaultColor = '#8884d8';
  const highlightColor = '#ff7300';
  const highlightDay = 'Thu';

  const CustomBar = (props) => {
    const { x, y, width, height, fill, payload } = props;
    const barFill = payload.date === highlightDay ? highlightColor : fill;
    const radius = 5;

    return (
      <g>
        <rect x={x} y={y} width={width} height={height} fill={barFill} rx={radius} ry={radius} />
      </g>
    );
  };

  return (
    <PageContainer title="Drivers Details" description="This is the driver profile page">
      <Breadcrumb title="Drivers Details" items={BCrumb} />
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        textColor="primary"
        sx={{
          '& .MuiTabs-flexContainer': {
            gap: 12,
          },
          '& .MuiTabs-indicator': {
            display: 'none',
          },
          margin: 0,
        }}
      >
        <Tab
          label="Personal Details"
          sx={{
            minWidth: 100,
            backgroundColor: tabValue === 0 ? 'primary.light' : 'white',
            color: '#116378',
            borderRadius: '12px',
            mx: 1,
            '&.Mui-selected': {
              backgroundColor: 'primary.light',
              color: '#116378',
            },
          }}
        />
        <Tab
          label="Assign Picks"
          sx={{
            minWidth: 100,
            backgroundColor: tabValue === 1 ? 'primary.light' : 'white',
            color: '#116378',
            borderRadius: '12px',
            mx: 1,
            '&.Mui-selected': {
              backgroundColor: 'primary.light',
              color: '#116378',
            },
          }}
        />
        <Tab
          label="Driver History"
          sx={{
            minWidth: 100,
            backgroundColor: tabValue === 2 ? 'primary.light' : 'white',
            color: '#116378',
            borderRadius: '12px',
            mx: 1,
            '&.Mui-selected': {
              backgroundColor: 'primary.light',
              color: '#116378',
            },
          }}
        />
      </Tabs>
      <br />
      <Divider sx={{ marginTop: 2 }} /> {/* Add a horizontal line */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <DashboardCard>
              <DashboardCard title="" sx={{ border: 1, borderColor: 'black.300', padding: 2 }}>
                <Container>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                    {/* <Button
                      variant="contained"
                      color="primary"
                      sx={{ minWidth: '120px', height: '36px' }}
                    >
                      Assign Pickup
                    </Button> */}
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                    <Avatar
                      alt="Driver Profile Picture"
                      src={`${imagePath}/${driverDetails.pfp_link}`}
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
                          disabled={!editMode}
                          onChange={(e) => handleChange('id', e.target.value)}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth margin="dense">
                        <FormLabel>Username</FormLabel>
                        <TextField
                          value={driverDetails.name}
                          variant="outlined"
                          disabled={!editMode}
                          onChange={(e) => handleChange('username', e.target.value)}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth margin="dense">
                        <FormLabel>Email</FormLabel>
                        <TextField
                          value={driverDetails.email}
                          variant="outlined"
                          disabled={!editMode}
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
                          value={formatPhoneNumber(driverDetails.mobile)}
                          variant="outlined"
                          disabled={!editMode}
                          onChange={(e) => handleChange('contact', e.target.value)}
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
                          disabled={!editMode}
                          onChange={(e) => handleChange('address', e.target.value)}
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
                          disabled={!editMode}
                          onChange={(e) => handleChange('city', e.target.value)}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Container>
              </DashboardCard>
              <Grid
                item
                xs={12}
                sm={12}
                container
                alignItems="center"
                justifyContent="right"
                sx={{ marginTop: '16px' }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    minWidth: '120px',
                    height: '36px',
                    marginRight: '10px',
                    background: '#5D87FF',
                  }}
                  onClick={handleEditToggle}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{
                    minWidth: '120px',
                    height: '36px',
                    marginRight: '10px',
                    background: '#FFC8B9',
                    color: '#FA896B',
                    borderColor: '#FA896B',
                    borderStyle: 'solid',
                    borderWidth: 1,
                  }}
                  onClick={handleDeleteDialogOpen}
                >
                  Delete
                </Button>
                <Button
                  variant="contained"
                  color="warning"
                  sx={{
                    minWidth: '120px',
                    height: '36px',
                    background: '#FFC8B9',
                    color: '#FA896B',
                    borderColor: '#FA896B',
                    borderStyle: 'solid',
                    borderWidth: 1,
                  }}
                  onClick={handleDeactivateDialogOpen}
                >
                  Deactivate
                </Button>
              </Grid>
            </DashboardCard>
          </Grid>
        </Grid>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <Box p={2} boxShadow={3} borderRadius={4}>
          <Box mb={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>Assign Pickups</Typography>
              <Box>
                <IconButton>
                  <Delete />
                </IconButton>
                <IconButton>
                  <FilterAlt />
                </IconButton>
              </Box>
            </Box>
          </Box>

          <Box sx={{ width: '100%' }}>
            <Tabs
              value={selectedSubTab}
              onChange={handleSubTabChange}
              textColor="primary"
              sx={{
                '& .MuiTabs-flexContainer': {
                  gap: 12,
                },
                '& .MuiTab-root': {
                  borderRadius: '8px 8px 0 0',
                  marginBottom: '-1px',
                  fontWeight: 'bold',
                  color: 'black',
                  '&.Mui-selected': {
                    backgroundColor: 'grey.300',
                    color: 'black',
                    fontWeight: 'bold',
                  },
                },
                '& .MuiTabs-indicator': {
                  display: 'none',
                },
              }}
            >
              <Tab label="Monday" />
              <Tab label="Tuesday" />
              <Tab label="Wednesday" />
              <Tab label="Thursday" />
              <Tab label="Friday" />
            </Tabs>
          </Box>

          <TableContainer
            component={Paper}
            sx={{ mt: 0, backgroundColor: 'grey.300', borderRadius: '0 0 8px 8px', p: 2 }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Address</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Adata.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.address}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        {/* Driver History Content */}
        <DashboardCard>
          <Grid container spacing={2}>
            <Grid
              item
              xs={12}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <Typography variant="h6" gutterBottom>
                Driver History
              </Typography>
              <Button style={{ background: '#0A7EA4', color: 'white' }} color="secondary"
              onClick={hadlePickupHistory}
              >
                View All Pickups
              </Button>
            </Grid>
            <Grid item xs={12} md={5}>
              <DashboardCard title="Total pickups" subtitle="This week">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                    <XAxis
                      dataKey="date"
                      style={{ marginTop: 20 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip />
                    <Bar
                      dataKey="value"
                      fill={defaultColor}
                      shape={(props) => <CustomBar {...props} />}
                    >
                      <LabelList dataKey="value" position="bottom" offset={25} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={6} container alignItems="center">
                    <Poll sx={{ fontSize: 40, marginRight: -2 }} />
                    <CardContent>
                      <Typography variant="h6">Total Pickups</Typography>
                      <Typography variant="h4">82</Typography>
                    </CardContent>
                  </Grid>
                  <Grid item xs={6} container alignItems="center">
                    <Poll sx={{ fontSize: 40, marginRight: -2 }} />
                    <CardContent>
                      <Typography variant="h6">This Week</Typography>
                      <Typography variant="h4">10</Typography>
                    </CardContent>
                  </Grid>
                </Grid>
              </DashboardCard>
            </Grid>
            <Grid item xs={12} md={7}>
              <DashboardCard>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Card style={{ background: '#0A7EA4', color: 'white', fontSize: 40 }}>
                      <CardContent>
                        <Typography textAlign={'center'} variant="h6">
                          Total Pickups
                        </Typography>
                        <Typography textAlign={'center'} variant="h4">
                          180
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6}>
                    <Card
                      style={{
                        color: '#949494',
                        borderStyle: 'solid',
                        borderWidth: 1,
                        borderColor: '#949494',
                      }}
                    >
                      <CardContent>
                        <Typography textAlign={'center'} variant="h6">
                          Total Assigned Pickups
                        </Typography>
                        <Typography textAlign={'center'} variant="h4">
                          180
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6}>
                    <Card style={{ background: '#0A7EA4', color: 'white' }}>
                      <CardContent>
                        <Typography textAlign={'center'} variant="h6">
                          Weekly Pickups
                        </Typography>
                        <Typography textAlign={'center'} variant="h4">
                          10
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6}>
                    <Card
                      style={{
                        color: '#949494',
                        borderStyle: 'solid',
                        borderWidth: 1,
                        borderColor: '#949494',
                      }}
                    >
                      <CardContent>
                        <Typography textAlign={'center'} variant="h6">
                          Cancelled Pickups
                        </Typography>
                        <Typography textAlign={'center'} variant="h4">
                          180
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6}>
                    <Card
                      style={{
                        background: '#0A7EA4',
                        color: 'white',
                        borderStyle: 'solid',
                        borderWidth: 1,
                        border: '#949494',
                      }}
                    >
                      <CardContent>
                        <Typography textAlign={'center'} variant="h6">
                          Monthly Pickups
                        </Typography>
                        <Typography textAlign={'center'} variant="h4">
                          50
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6}>
                    <Card
                      style={{
                        color: '#949494',
                        borderStyle: 'solid',
                        borderWidth: 1,
                        borderColor: '#949494',
                      }}
                    >
                      <CardContent>
                        <Typography textAlign={'center'} variant="h6">
                          Total Pickups For This Week
                        </Typography>
                        <Typography textAlign={'center'} variant="h4">
                          180
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </DashboardCard>
            </Grid>
          </Grid>
        </DashboardCard>
      </TabPanel>
      <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the driver? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteDriver} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={successDialogOpen} onClose={handleSuccessDialogClose}>
        <DialogTitle>Success</DialogTitle>
        <DialogContent>
          <DialogContentText>Driver successfully deleted.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSuccessDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deactivateDialogOpen} onClose={handleDeactivateDialogClose}>
        <DialogTitle>Confirm Deactivation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to deactivate the driver? This action can be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeactivateDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeactivateDriver} color="secondary">
            Deactivate
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default DriverProfile;
