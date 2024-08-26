import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Tab,
  Tabs,
  Typography,
  Grid,
  TextField,
  TableCell,
  TableRow,
  TableHead,
  TableBody,
  Table,
  TableContainer,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl
} from '@mui/material';
import Breadcrumb from '../../layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import CalendarComponent from './Components/calender'; // Adjust import path as per your file structure
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import AddDetailsComponent from './Components/addDetailsComponent';
import IOSSwitch from '../../views/timeSlots/Components/iosSwitch.jsx'

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Time Slots',
  },
];


// Testing credentials
const username = 'root';
const password = 't2c';
// Encode credentials to Base64
const encodedCredentials = btoa(`${username}:${password}`);

const formatTime = (pickupTime) => {
  if (!pickupTime) return 'N/A'; // Handle null or undefined cases

  // Split the time string into hours, minutes, and seconds
  const [hours, minutes, seconds] = pickupTime.split(':');

  // Create a new Date object
  const dateObj = new Date();

  // Set hours, minutes, and seconds to the Date object
  dateObj.setHours(hours);
  dateObj.setMinutes(minutes);
  dateObj.setSeconds(seconds);

  // Format the Date object to AM/PM format
  const formattedTime = dateObj.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  return formattedTime;
};

// This is the model for pre define timeslots
const PredefineTimeslots = ({ open, handleClose }) => {
  const navigate = useNavigate();
const hadleAddTime=()=>{
  navigate('/addTime');
};

  return (
    <Dialog open={open} onClose={handleClose} sx={{ borderRadius: '8px', minWidth: '300px'}}>
      <DialogTitle sx={{ textAlign: 'center', color: '#0F6C85', paddingLeft:'100px', paddingRight:'100px' , paddingTop:'20px'}}>Sector Has No Time Slots</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ textAlign: 'center', fontWeight: 'bold', color: '#798A8E' }}>
          Pre define time slots are available<br />
          <br />
          <Grid> 
          <Grid item xs={12} md={6} mb={2}>
            <Box fullWidth display={'flex'} justifyContent={'space-between'} sx={{border:'2px solid grey', padding:'8px 20px 8px 20px' }}> 
              <Typography variant='outlined'>
                8.00 am - 9.00 am
              </Typography>
              <IOSSwitch 
              //onChange={}       //add logic here to assign timeslot
              ></IOSSwitch>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} mb={2}>
            <Box fullWidth display={'flex'} justifyContent={'space-between'} sx={{border:'2px solid grey', padding:'8px 20px 8px 20px' }}> 
              <Typography variant='outlined'>
                8.00 am - 9.00 am
              </Typography>
              <IOSSwitch
                //onChange={}       //add logic here to assign timeslot
              ></IOSSwitch>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} mb={2}>
            <Box fullWidth display={'flex'} justifyContent={'space-between'} sx={{border:'2px solid grey', padding:'8px 20px 8px 20px' }}> 
              <Typography variant='outlined'>
                8.00 am - 9.00 am
              </Typography>
              <IOSSwitch
                //onChange={}       //add logic here to assign timeslot
              ></IOSSwitch>
            </Box>
          </Grid>
        </Grid>
        <Box display={'flex'} fullWidth justifyContent={'space-between'} alignItems={'center'}>
          <Typography>
            If you need to add another timeslot
          </Typography>
          <Button
          sx={{fontWeight:'bold'}}
          onClick={hadleAddTime}  //Add new timeslot logic here
          >
            Add Time Slot
          </Button>
        </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button onClick={handleClose} variant="contained" color="primary" sx={{paddingLeft:'20px', paddingRight:'20px'}}>
          Save
        </Button>
      </DialogActions>
      <br/>
    </Dialog>
  );
};

const TimeSlots = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [sectors, setSectors] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

//this for predefeine timeslot model
  const [predefineTimeSlotOpen, setPredefineTimeSlotOpen] = useState(false); // New state for reschedule dialog
  const handleTimeslotModel = () => {
    setPredefineTimeSlotOpen(true); // Open the reschedule dialog
  };
  const handleCloseTimeslot = () => {
    setPredefineTimeSlotOpen(false);
    // Optionally, perform any additional actions after closing the reschedule dialog
  };


  useEffect(() => {
    const fetchTimeslotSectors = async () => {
      try {
        const response = await axios.get(
          'http://ec2-18-143-176-53.ap-southeast-1.compute.amazonaws.com:8080/api/sectors/names',
          {
            headers: {
              Authorization: `Basic ${encodedCredentials}`,
            },
          },
        );
        console.log(response.data);
        setSectors(response.data);
        setSelectedTab(0);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching sectors', error);
      }
    };

    fetchTimeslotSectors();
  }, []);

  useEffect(() => {
    const fetchTableData = async () => {
      setLoading(true); // Set loading to true when fetching data
      if (sectors && sectors.length > 0) {
        try {
          const selectedSector = sectors[selectedTab];
          const response = await axios.get(
            `http://ec2-18-143-176-53.ap-southeast-1.compute.amazonaws.com:8080/api/timeslots/date/name`,
            {
              params: {
                date: format(new Date(selectedDate), 'yyyy-MM-dd'),
                name: selectedSector,
              },
              headers: {
                Authorization: `Basic ${encodedCredentials}`,
              },
            },
          );
          setTableData(response.data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching table data', error);
        }
      }
      setLoading(false); // Set loading to false after fetching data
    };

    fetchTableData();
  }, [selectedTab, selectedDate, sectors]);

  const handleAdd = () => {
    navigate('/addSector');
  };

  const handleEdit = (date, sector, timeslots) => {
    navigate('/editTime', { state: { date, sector, timeslots } });
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleSelectDate = (date) => {
    setLoading(true);
    setSelectedDate(date);
  };

  return (
    <PageContainer title="Time Slots" description="This is the Time Slots">
      <Breadcrumb title="Time Slots" items={BCrumb} />
      <DashboardCard>
        <Box display="flex" justifyContent="center" mb={2}>
          <Grid container justifyContent="center" sx={{ maxWidth: '90%', overflowX: 'auto' }}>
            {sectors === null ? (
              <CircularProgress />
            ) : (
              <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                TabIndicatorProps={{ style: { display: 'none' } }}
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  '.MuiTab-root': {
                    transition: 'background-color 0.3s',
                    borderRadius: '4px',
                    marginRight: '8px',
                    marginBottom: 2,
                  },
                  '.Mui-selected': {
                    backgroundColor: 'grey.300',
                  },
                  '& .MuiTabs-flexContainer': { gap: 2 },
                }}
              >
                {sectors.map((sector, index) => (
                  <Tab
                    key={index}
                    label={sector}
                    sx={{
                      minWidth: 100,
                      backgroundColor: selectedTab === index ? 'primary.light' : 'white',
                      color: selectedTab === index ? 'white' : 'black',
                      borderRadius: '4px',
                    }}
                  />
                ))}
              </Tabs>
            )}
          </Grid>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAdd}
            sx={{ height: '40px', ml: 2 }}
          >
            Add
          </Button>
          <Button
          variant='contained'
          color='primary'
          sx={{ height: '40px', ml: 2, fontSize:'10px' }}
          onClick={handleTimeslotModel}
          > 
            Pre-Define Timeslot
          </Button>
        </Box>
        <Grid container spacing={1} sx={{ p: 2, position: 'relative', minHeight: '400px' }}>
          <Grid item xs={12} md={6}>
            <Box>
              <br />
              <br />
              <CalendarComponent onSelectDate={handleSelectDate} />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box>
              <br />
              <br />
              {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="300px">
                  <CircularProgress />
                </Box>
              ) : tableData.length === 0 ? (
                <AddDetailsComponent
                  sector={sectors != null ? sectors[selectedTab] : sectors}
                  date={selectedDate}
                />
              ) : (
                <>
                  <Typography sx={{ fontSize: '18px', color: '#116378', fontWeight: 'bold' }}>
                    {selectedDate.toDateString()}
                  </Typography>
                  <TableContainer>
                    <Table sx={{ minWidth: 300 }}>
                      <TableHead>
                        <TableRow>
                          <TableCell style={{ fontSize: '14px', fontWeight: 'bold' }}>
                            Time Slots
                          </TableCell>
                          <TableCell style={{ fontSize: '14px', fontWeight: 'bold' }}>
                            Max Pickups
                          </TableCell>
                        </TableRow>
                        <Box sx={{ visibility: 'hidden', height: 0 }}>
                          <TableCell
                            style={{
                              borderBottom: '1px solid #ccc',
                              padding: '8px',
                              fontSize: '10px',
                            }}
                          >
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                              <TextField
                                variant="outlined"
                                size="small"
                                style={{ marginRight: 5 }}
                                InputProps={{
                                  style: { textAlign: 'center' },
                                }}
                              />
                              <Typography sx={{ mx: 1 }}>-</Typography>
                              <TextField
                                variant="outlined"
                                size="small"
                                InputProps={{
                                  style: { textAlign: 'center' },
                                }}
                              />
                            </Box>
                          </TableCell>
                          <TableCell
                            style={{
                              borderBottom: '1px solid #ccc',
                              padding: '40px',
                              fontSize: '10px',
                              textAlign: 'center',
                            }}
                          >
                            <Typography>0</Typography>
                          </TableCell>
                        </Box>
                      </TableHead>
                    </Table>
                    <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
                      <Table>
                        <TableBody>
                          {tableData.map((row, index) => (
                            <TableRow key={index}>
                              <TableCell
                                style={{
                                  borderBottom: '1px solid #ccc',
                                  padding: '8px',
                                  fontSize: '10px',
                                }}
                              >
                                <Box
                                  display="flex"
                                  alignItems="center"
                                  justifyContent="space-between"
                                >
                                  <TextField
                                    variant="outlined"
                                    size="small"
                                    style={{ marginRight: 5 }}
                                    value={formatTime(row.from)}
                                    InputProps={{
                                      style: { textAlign: 'center' },
                                    }}
                                  />
                                  <Typography sx={{ mx: 1 }}>-</Typography>
                                  <TextField
                                    variant="outlined"
                                    size="small"
                                    value={formatTime(row.to)}
                                    InputProps={{
                                      style: { textAlign: 'center' },
                                    }}
                                  />
                                </Box>
                              </TableCell>
                              <TableCell
                                style={{
                                  borderBottom: '1px solid #ccc',
                                  padding: '40px',
                                  fontSize: '10px',
                                  textAlign: 'center',
                                }}
                              >
                                <Typography>{row.max}</Typography>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Box>
                  </TableContainer>
                </>
              )}
            </Box>
          </Grid>
          {!loading && tableData.length > 0 && (
            <Box
              position="absolute"
              bottom={-30}
              right={20}
              display="flex"
              justifyContent="flex-end"
              sx={{ p: 2 }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={() =>
                  handleEdit(
                    selectedDate,
                    sectors != null ? sectors[selectedTab] : sectors,
                    tableData,
                  )
                }
              >
                Edit
              </Button>
            </Box>
          )}
        </Grid>
      </DashboardCard>
      <PredefineTimeslots open={predefineTimeSlotOpen} handleClose={handleCloseTimeslot} />
    </PageContainer>
  );
};

export default TimeSlots;
