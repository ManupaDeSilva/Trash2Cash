import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  InputAdornment,
  Button,
  Box,
  Typography,
  Tab,
  Tabs,
  TablePagination,
  Fade,
  Backdrop,
  Card,
  CardContent,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
} from '@mui/material';
import { TabContext, TabPanel } from '@mui/lab';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import axios from 'axios';
import dayjs from 'dayjs';
import L, { LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Modal } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { format } from 'date-fns';
import { DateRange, LocalShipping } from '@mui/icons-material';
import { IconBook, IconScale, IconShirt, IconTruckDelivery } from '@tabler/icons';
import FilterAlt from '@mui/icons-material/FilterAlt'; // Import FilterAlt icon
import Delete from '@mui/icons-material/Delete'; // Import Delete icon

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Pickups',
  },
];

// Testing credentials
const username = 'root';
const password = 't2c';
// Encode credentials to Base64
const encodedCredentials = btoa(`${username}:${password}`);
const apiKey = 'AIzaSyAqiRkh8Sj4hGbLbMiezln6AFIXG-6POFg'; // Replace with your actual API key

const fetchAddressFromCoordinates = async (jsonString) => {
  try {
    const jsonObject = JSON.parse(jsonString);
    const { lat, long: lon } = jsonObject;

    if (!lat || !lon) {
      throw new Error('Invalid JSON format. Please provide both lat and long.');
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${apiKey}`,
    );
    const data = await response.json();

    if (data.status === 'OK' && data.results && data.results[0]) {
      const addressParts = data.results[0].formatted_address;
      return addressParts;
    } else {
      throw new Error('Unable to fetch address');
    }
  } catch (error) {
    throw new Error(`Error: ${error.message}`);
  }
};

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

const formatDate = (date) => {
  return dayjs(date).format('MM/DD/YYYY');
};

const formatDateTime = (pickupTime) => {
  return dayjs(pickupTime, 'HH:mm:ss').format('hh:mm A');
};

const Pickups = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const [pickupsDates, setPickupsDates] = useState([]);
  const [completedPickupsDates, setCompletedPickupsDates] = useState([]);
  const [pickupRequestsDates, setPickupRequestsDates] = useState([]);
  const [cancelledPickupsDates, setCancelledPickupsDates] = useState([]);

  const [pickupsInfo, setPickupsInfo] = useState([]);
  const [pickupRequestsInfo, setPickupRequestsInfo] = useState([]);
  const [completedPickupsInfo, setCompletedPickupsInfo] = useState([]);
  const [cancelledPickupsInfo, setCancelledPickupsInfo] = useState([]);

  const [pickups, setPickups] = useState([]);
  const [pickupRequests, setPickupRequests] = useState([]);
  const [completedPickups, setCompletedPickups] = useState([]);
  const [cancelledPickups, setCancelledPickups] = useState([]);

  const [tabValue, setTabValue] = useState('0');
  const [selectedDate, setSelectedDate] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [selectedLocation, setSelectedLocation] = useState({ lat: 0, lon: 0 });
  const [mapOpen, setMapOpen] = useState(false);
  const [sortCriteria, setSortCriteria] = useState('date'); // Default sorting by date
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    const handlePopState = (event) => {
      if (selectedDate) {
        event.preventDefault();
        selectedDate(null);
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);

  useEffect(() => {
    const fetchPickupsDates = async () => {
      try {
        const response = await axios.get(
          'http://ec2-18-143-176-53.ap-southeast-1.compute.amazonaws.com:8080/api/pickups/assigned/dates',
          {
            params: {
              page: page,
              size: rowsPerPage,
            },
            headers: {
              Authorization: `Basic ${encodedCredentials}`,
            },
          },
        );
        console.log(response.data);
        if (pickupsDates.length == 0) {
          setPickupsDates(response.data.content);
        } else {
          setPickupsDates([...pickupsDates, ...response.data.content]);
        }
        setTotalRecords(response.data.totalElements);
      } catch (error) {
        console.error('Error fetching Pickups', error);
      }
    };

    const fetchPickupRequestsDates = async () => {
      try {
        const response = await axios.get(
          'http://ec2-18-143-176-53.ap-southeast-1.compute.amazonaws.com:8080/api/home-points/unscheduled/dates',
          {
            params: {
              page: page,
              size: rowsPerPage,
            },
            headers: {
              Authorization: `Basic ${encodedCredentials}`,
            },
          },
        );
        console.log(response.data);
        if (pickupRequestsDates.length == 0) {
          setPickupRequestsDates(response.data.content);
        } else {
          setPickupRequestsDates([...pickupRequestsDates, ...response.data.content]);
        }
        setTotalRecords(response.data.totalElements);
      } catch (error) {
        console.error('Error fetching Pickups', error);
      }
    };

    const fetchCompletedPickupsDates = async () => {
      try {
        const response = await axios.get(
          'http://ec2-18-143-176-53.ap-southeast-1.compute.amazonaws.com:8080/api/pickups/completed/dates',
          {
            params: {
              page: page,
              size: rowsPerPage,
            },
            headers: {
              Authorization: `Basic ${encodedCredentials}`,
            },
          },
        );
        console.log(response.data);
        if (completedPickupsDates.length == 0) {
          setCompletedPickupsDates(response.data.content);
        } else {
          setCompletedPickupsDates([...completedPickupsDates, ...response.data.content]);
        }
        setTotalRecords(response.data.totalElements);
      } catch (error) {
        console.error('Error fetching Pickups', error);
      }
    };

    const fetchCancelledPickupsDates = async () => {
      try {
        const response = await axios.get(
          'http://ec2-18-143-176-53.ap-southeast-1.compute.amazonaws.com:8080/api/pickups/cancelled/dates',
          {
            params: {
              page: page,
              size: rowsPerPage,
            },
            headers: {
              Authorization: `Basic ${encodedCredentials}`,
            },
          },
        );
        console.log(response.data);
        if (cancelledPickupsDates.length == 0) {
          setCancelledPickupsDates(response.data.content);
        } else if (!cancelledPickupsDates.some((item) => response.data.content.includes(item))) {
          // setCancelledPickupsDates(response.data.content);
        } else {
          setCancelledPickupsDates([...cancelledPickupsDates, ...response.data.content]);
        }
        setTotalRecords(response.data.totalElements);
      } catch (error) {
        console.error('Error fetching Pickups', error);
      }
    };

    const fetchData = async () => {
      switch (tabValue) {
        case '0':
          await fetchPickupsDates();
          break;
        case '1':
          await fetchPickupRequestsDates();
          break;
        case '2':
          await fetchCompletedPickupsDates();
          break;
        case '3':
          await fetchCancelledPickupsDates();
          break;
        default:
          await fetchPickupsDates();
          break;
      }
    };
    fetchData();
  }, [page, rowsPerPage, tabValue]);

  useEffect(() => {
    const fetchPickupRequests = async () => {
      try {
        const response = await axios.get(
          `http://ec2-18-143-176-53.ap-southeast-1.compute.amazonaws.com:8080/api/home-points/unscheduled/${format(
            new Date(selectedDate),
            'yyyy-MM-dd',
          )}`,
          {
            headers: {
              Authorization: `Basic ${encodedCredentials}`,
            },
          },
        );
        console.log(response.data[0]);
        const dataWithAddresses = await Promise.all(
          response.data.map(async (pickup) => {
            const address = await fetchAddressFromCoordinates(pickup.location);
            const loc = pickup.location;
            // const address = pickup.location;
            return {
              ...pickup,
              location: { loc, address },
            };
          }),
        );
        console.log(dataWithAddresses[0]);
        setPickupRequests(dataWithAddresses);

        const response2 = await axios.get(
          `http://ec2-18-143-176-53.ap-southeast-1.compute.amazonaws.com:8080/api/home-points/unscheduled/info/${format(
            new Date(selectedDate),
            'yyyy-MM-dd',
          )}`,
          {
            headers: {
              Authorization: `Basic ${encodedCredentials}`,
            },
          },
        );
        setPickupRequestsInfo(response2.data);
      } catch (error) {
        console.error('Error fetching Pickup Requests', error);
      }
    };

    const fetchPickups = async () => {
      try {
        const response = await axios.get(
          `http://ec2-18-143-176-53.ap-southeast-1.compute.amazonaws.com:8080/api/pickups/assigned/${format(
            new Date(selectedDate),
            'yyyy-MM-dd',
          )}`,
          {
            headers: {
              Authorization: `Basic ${encodedCredentials}`,
            },
          },
        );
        console.log(response.data);
        const dataWithAddresses = await Promise.all(
          response.data.map(async (pickup) => {
            const address = await fetchAddressFromCoordinates(pickup.home_point.location);
            const loc = pickup.home_point.location;
            // const address = pickup.home_point.location;
            return {
              ...pickup,
              location: { loc, address },
            };
          }),
        );
        console.log(dataWithAddresses[0]);
        setPickups(dataWithAddresses);

        const response2 = await axios.get(
          `http://ec2-18-143-176-53.ap-southeast-1.compute.amazonaws.com:8080/api/pickups/assigned/info/${format(
            new Date(selectedDate),
            'yyyy-MM-dd',
          )}`,
          {
            headers: {
              Authorization: `Basic ${encodedCredentials}`,
            },
          },
        );
        setPickupsInfo(response2.data);
      } catch (error) {
        console.error('Error fetching Pickups', error);
      }
    };

    const fetchCompletedPickups = async () => {
      try {
        const response = await axios.get(
          `http://ec2-18-143-176-53.ap-southeast-1.compute.amazonaws.com:8080/api/pickups/completed/${format(
            new Date(selectedDate),
            'yyyy-MM-dd',
          )}`,
          {
            headers: {
              Authorization: `Basic ${encodedCredentials}`,
            },
          },
        );
        const dataWithAddresses = await Promise.all(
          response.data.map(async (pickup) => {
            const address = await fetchAddressFromCoordinates(pickup.home_point.location);
            const loc = pickup.home_point.location;
            // const address = pickup.home_point.location;
            return {
              ...pickup,
              location: { loc, address },
            };
          }),
        );
        setCompletedPickups(dataWithAddresses);

        const response2 = await axios.get(
          `http://ec2-18-143-176-53.ap-southeast-1.compute.amazonaws.com:8080/api/pickups/completed/info/${format(
            new Date(selectedDate),
            'yyyy-MM-dd',
          )}`,
          {
            headers: {
              Authorization: `Basic ${encodedCredentials}`,
            },
          },
        );
        setCompletedPickupsInfo(response2.data);
      } catch (error) {
        console.error('Error fetching Completed Pickups', error);
      }
    };

    const fetchCancelledPickups = async () => {
      try {
        const response = await axios.get(
          `http://ec2-18-143-176-53.ap-southeast-1.compute.amazonaws.com:8080/api/pickups/cancelled/${format(
            new Date(selectedDate),
            'yyyy-MM-dd',
          )}`,
          {
            headers: {
              Authorization: `Basic ${encodedCredentials}`,
            },
          },
        );
        const dataWithAddresses = await Promise.all(
          response.data.map(async (pickup) => {
            const address = await fetchAddressFromCoordinates(pickup.home_point.location);
            const loc = pickup.home_point.location;
            // const address = pickup.home_point.location;
            return {
              ...pickup,
              location: { loc, address },
            };
          }),
        );
        setCancelledPickups(dataWithAddresses);

        const response2 = await axios.get(
          `http://ec2-18-143-176-53.ap-southeast-1.compute.amazonaws.com:8080/api/pickups/cancelled/info/${format(
            new Date(selectedDate),
            'yyyy-MM-dd',
          )}`,
          {
            headers: {
              Authorization: `Basic ${encodedCredentials}`,
            },
          },
        );
        setCancelledPickupsInfo(response2.data);
      } catch (error) {
        console.error('Error fetching Completed Pickups', error);
      }
    };

    const fetchData = async () => {
      switch (tabValue) {
        case '0':
          await fetchPickups();
          break;
        case '1':
          await fetchPickupRequests();
          break;
        case '2':
          await fetchCompletedPickups();
          break;
        case '3':
          await fetchCancelledPickups();
          break;
        default:
          await fetchPickups();
          break;
      }
    };
    if (selectedDate != null) {
      fetchData();
    }
  }, [selectedDate]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortCriteria(event.target.value);
  };

  const sortedAndFilteredDates = (dates) => {
    const filteredDates = dates.filter((date) =>
      date.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return filteredDates.sort((a, b) => {
      if (sortCriteria === 'date') {
        return new Date(a) - new Date(b);
      }
      return 0;
    });
  };

  const handleEdit = (pickup) => {
    navigate(`/view-pickup/${pickup.home_point.hp_id}`, { state: { pickup } });
  };

  const handleViewCompletePickup = (pickup) => {
    navigate(`/complete-pickup/${pickup.home_point.hp_id}`, { state: { pickup } });
  };

  const handleAddPickup = () => {
    navigate('/add-pickup');
  };

  const handleAssign = (hp_id) => {
    if (hp_id != null) {
      navigate(`/assign-a-rider?hp_id=${hp_id}`);
    } else {
      navigate(`/assign-a-rider`);
    }
  };

  const handleUserClicked = (userDetails) => {
    const user = userDetails;
    navigate(`/user/details/${userDetails.user_id}`, { state: { user } });
  };

  const formatItems = (items) => {
    const formattedItems = [];
    if (items.pct > 0) formattedItems.push(`P C T : ${items.pct}`);
    if (items.gbottles > 0) formattedItems.push(`Glass Bottles: ${items.gbottles}`);
    if (items.papers > 0) formattedItems.push(`Paper Waste: ${items.gbottles}`);
    if (items.books > 0) formattedItems.push(`Books: ${items.books}`);
    if (items.clothes > 0) formattedItems.push(`Clothes: ${items.clothes}`);
    return formattedItems;
  };

  const handleLocationClick = (location) => {
    const jsonObject = JSON.parse(location);
    const { lat, long: lon } = jsonObject;
    setSelectedLocation({ lat, lon });
    setMapOpen(true);
  };

  const closeModal = () => {
    setMapOpen(false);
  };

  // Function to initialize Google Map with marker
  const initializeMap = () => {
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: { lat: selectedLocation.lat, lng: selectedLocation.lon },
      zoom: 14,
    });

    // Add marker
    new window.google.maps.Marker({
      position: { lat: selectedLocation.lat, lng: selectedLocation.lon },
      map,
      title: 'Selected Location',
    });
  };

  // Load Google Maps API script dynamically
  const loadGoogleMaps = () => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initializeMap`;
    script.defer = true;
    script.async = true;
    window.initializeMap = initializeMap;
    document.body.appendChild(script);
  };

  useEffect(() => {
    if (mapOpen) {
      loadGoogleMaps();
    }
  }, [mapOpen]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    console.log(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const capitalize = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  const DateCards = ({ dates, onDateClick }) => {
    // Calculate the start and end index
    const startIndex = page * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, totalRecords);
    // Get the subset of dates for the current page
    const paginatedDates = dates.slice(startIndex, endIndex);

    return (
      <>
        <Grid container spacing={2} justifyContent="center">
          {paginatedDates.map((date, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card
                variant="outlined"
                onClick={() => onDateClick(date.date)}
                sx={{
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <CardContent style={{ color: '#116378' }}>
                  <Grid container alignItems="center">
                    <Grid item xs={9}>
                      <Grid
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexDirection: 'row',
                        }}
                      >
                        <Grid item>
                          <EventIcon color="primary" sx={{ size: '40px', marginRight: 2 }} />
                        </Grid>
                        <Grid item xs>
                          <Typography variant="h9" component="div" sx={{ fontWeight: 'bold' }}>
                            {formatDate(date.date)}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexDirection: 'row',
                        }}
                      >
                        {/* <Grid item>
                          <AccessTimeIcon color="primary" sx={{ fontSize: 40, marginRight: 2 }} />
                        </Grid> */}
                        {/* <Grid item xs>
                          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                            Timeslots : {date.timeslots}
                          </Typography>
                        </Grid> */}
                      </Grid>
                      <Grid
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexDirection: 'row',
                        }}
                      >
                        <Grid item>
                          <PeopleIcon color="primary" sx={{ size: '40px', marginRight: 2 }} />
                        </Grid>
                        <Grid item xs>
                          <Typography variant="h9" component="div" sx={{ fontWeight: 'bold' }}>
                            Customers : {date.users}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid>
                      <IconButton sx={{ size: '40px' }}>
                        <ArrowForwardIosIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <TablePagination
          rowsPerPageOptions={[12, 24, 48, 96, 192]}
          component="div"
          count={totalRecords}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </>
    );
  };

  const filteredPickups = pickups.filter((pickup) =>
    selectedDate ? pickup.home_point.timeslot.date === selectedDate : true,
  );
  const filteredPickupsRequests = pickupRequests.filter((pickup) =>
    selectedDate ? pickup.timeslot.date === selectedDate : true,
  );
  const filteredCompletedPickups = completedPickups.filter((pickup) =>
    selectedDate ? pickup.home_point.timeslot.date === selectedDate : true,
  );
  const filteredCancelledPickups = cancelledPickups.filter((pickup) =>
    selectedDate ? pickup.home_point.timeslot.date === selectedDate : true,
  );

  const renderPickupsTable = () => {
    const groupByTimeslot = (pickups) => {
      return pickups.reduce((acc, pickup) => {
        console.log(pickup);
        const { timeslot } = pickup.home_point;
        console.log(timeslot);
        if (!acc[timeslot.id]) {
          acc[timeslot.id] = [];
        }
        acc[timeslot.id].push(pickup);
        return acc;
      }, {});
    };

    const groupedPickups = groupByTimeslot(filteredPickups);
    return (
      <>
        {!selectedDate ? (
          <DateCards dates={pickupsDates} onDateClick={handleDateClick} />
        ) : pickups.length <= 0 ? (
          <CircularProgress></CircularProgress>
        ) : (
          <>
            {pickupsInfo.length === 0 ? (
              <CircularProgress></CircularProgress>
            ) : (
              <Grid
                container
                sx={{ padding: 2 }}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Grid item>
                  <Typography variant="h3">
                    {dayjs(selectedDate).format('MM / DD / YYYY')}
                  </Typography>
                  <Typography variant="h3">Time Slots</Typography>
                </Grid>
                <Grid
                  item
                  style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 30 }}
                >
                  <Grid
                    item
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <LocalShipping />
                    <Typography variant="body1">{pickupsInfo.pickups} Pickups</Typography>
                  </Grid>
                  <Grid
                    item
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <IconScale />
                    <Typography variant="body1">{pickupsInfo.kg} Kg</Typography>
                  </Grid>
                  <Grid
                    item
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <IconShirt />
                    <Typography variant="body1">{pickupsInfo.pieces} pieces</Typography>
                  </Grid>
                  <Grid
                    item
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <IconBook />
                    <Typography variant="body1">{pickupsInfo.books} Books</Typography>
                  </Grid>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setSelectedDate(null);
                      setPickups([]);
                      setPickupRequests([]);
                      setCompletedPickups([]);
                      setCancelledPickups([]);
                    }}
                  >
                    <ArrowBackIosIcon /> Dates
                  </Button>
                </Grid>
              </Grid>
            )}
            {Object.keys(groupedPickups).map((timeslotId) => (
              <Accordion key={timeslotId} style={{ color: '#116378' }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel-${timeslotId}-content`}
                  id={`panel-${timeslotId}-header`}
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography>
                      <h1 style={{ margin: 0 }}>
                        {formatTime(groupedPickups[timeslotId][0].home_point.timeslot.from)}-
                        {formatTime(groupedPickups[timeslotId][0].home_point.timeslot.to)} (
                        {groupedPickups[timeslotId][0].home_point.timeslot.sector.name})
                      </h1>
                      <h2 style={{ margin: 0, marginTop: 5 }}>
                        Pickups : {groupedPickups[timeslotId].length}
                      </h2>
                    </Typography>
                    {/* <Button
                      variant="contained"
                      sx={{ ml: 2 }}
                      // onClick={() => handleAssignAll(timeslotId)}
                    >
                      Assign All
                    </Button> */}
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>Driver</TableCell>
                          <TableCell>Time Slot</TableCell>
                          <TableCell>Location</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {groupedPickups[timeslotId]
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .filter((pickup) =>
                            pickup.driver.name.toLowerCase().includes(searchTerm.toLowerCase()),
                          )
                          .map((pickup) => (
                            <TableRow key={pickup.home_point.hp_id}>
                              <TableCell>{pickup.home_point.hp_id}</TableCell>
                              <TableCell>{pickup.driver ? pickup.driver.name : 'N/A'}</TableCell>
                              <TableCell>
                                {formatDate(pickup.home_point.timeslot.date)}
                                <br />
                                {formatTime(pickup.home_point.timeslot.from)}-
                                {formatTime(pickup.home_point.timeslot.to)}
                              </TableCell>
                              <TableCell>
                                <Box
                                  onClick={() => handleLocationClick(pickup.home_point.location)}
                                  sx={{
                                    display: 'inline-block',
                                    cursor: 'pointer',
                                    color: 'primary.main',
                                    padding: '8px 16px',
                                    textTransform: 'none',
                                    boxShadow: 1,
                                    backgroundColor: 'rgba(255, 255, 255, 0.6)', // light color with transparency
                                    borderRadius: '4px',
                                    transition: 'background-color 0.3s',
                                    '&:hover': {
                                      backgroundColor: 'rgba(255, 255, 255, 0.8)', // slightly less transparent on hover
                                    },
                                  }}
                                >
                                  {pickup.location.address}
                                </Box>
                              </TableCell>
                              <TableCell>{capitalize(pickup.pickupStatus.status)}</TableCell>
                              <TableCell>
                                <IconButton onClick={() => handleEdit(pickup)}>
                                  <EditIcon />
                                </IconButton>
                                {/* <IconButton>
                                  <MoreVertIcon />
                                </IconButton> */}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      component="div"
                      count={totalRecords}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </TableContainer>
                </AccordionDetails>
              </Accordion>
            ))}
          </>
        )}
      </>
    );
  };

  const renderPickupRequestsTable = () => {
    const groupByTimeslot = (requests) => {
      return requests.reduce((acc, request) => {
        const { timeslot } = request;
        if (!acc[timeslot.id]) {
          acc[timeslot.id] = [];
        }
        acc[timeslot.id].push(request);
        return acc;
      }, {});
    };

    const groupedRequests = groupByTimeslot(filteredPickupsRequests);

    return (
      <>
        {!selectedDate ? (
          <DateCards dates={pickupRequestsDates} onDateClick={handleDateClick} />
        ) : pickupRequests.length <= 0 ? (
          <CircularProgress></CircularProgress>
        ) : (
          <>
            {pickupRequestsInfo.length === 0 ? (
              <CircularProgress></CircularProgress>
            ) : (
              <Grid
                container
                sx={{ padding: 2 }}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Grid item>
                  <Typography variant="h3">
                    {dayjs(selectedDate).format('MM / DD / YYYY')}
                  </Typography>
                  <Typography variant="h3">Time Slots</Typography>
                </Grid>
                <Grid
                  item
                  style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 25 }}
                >
                  <Grid
                    item
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <LocalShipping />
                    <Typography variant="body1">{pickupRequestsInfo.pickups} Pickups</Typography>
                  </Grid>
                  <Grid
                    item
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <IconScale />
                    <Typography variant="body1">{pickupRequestsInfo.kg} Kg</Typography>
                  </Grid>
                  <Grid
                    item
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <IconShirt />
                    <Typography variant="body1">{pickupRequestsInfo.pieces} pieces</Typography>
                  </Grid>
                  <Grid
                    item
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <IconBook />
                    <Typography variant="body1">{pickupRequestsInfo.books} Books</Typography>
                  </Grid>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setSelectedDate(null);
                      setPickups([]);
                      setPickupRequests([]);
                      setCompletedPickups([]);
                      setCancelledPickups([]);
                    }}
                  >
                    <ArrowBackIosIcon /> Dates
                  </Button>
                </Grid>
              </Grid>
            )}
            {Object.keys(groupedRequests).map((timeslotId) => (
              <Accordion key={timeslotId} style={{ color: '#116378' }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel-${timeslotId}-content`}
                  id={`panel-${timeslotId}-header`}
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography>
                      <h1 style={{ margin: 0 }}>
                        {formatTime(groupedRequests[timeslotId][0].timeslot.from)}-
                        {formatTime(groupedRequests[timeslotId][0].timeslot.to)} (
                        {groupedRequests[timeslotId][0].timeslot.sector.name})
                      </h1>
                      <h2 style={{ margin: 0, marginTop: 5 }}>
                        Pickups : {groupedRequests[timeslotId].length}
                      </h2>
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{ ml: 2 }}
                      // onClick={() => handleAssignAll(timeslotId)}
                    >
                      Assign All
                    </Button>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>User Name</TableCell>
                          <TableCell>Time Slot</TableCell>
                          <TableCell>Location</TableCell>
                          <TableCell>Items</TableCell>
                          <TableCell>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {groupedRequests[timeslotId]
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .filter((request) =>
                            request.user.name.toLowerCase().includes(searchTerm.toLowerCase()),
                          )
                          .map((request) => (
                            <TableRow key={request.hp_id}>
                              <TableCell>{request.hp_id}</TableCell>
                              <TableCell onClick={() => handleUserClicked(request.user)}>
                                {request.user.name}
                              </TableCell>
                              <TableCell>
                                {formatDate(request.timeslot.date)}
                                <br />
                                {formatTime(request.timeslot.from)}-
                                {formatTime(request.timeslot.to)}
                              </TableCell>
                              <TableCell>
                                <Box
                                  onClick={() => handleLocationClick(request.location.loc)}
                                  sx={{
                                    display: 'inline-block',
                                    cursor: 'pointer',
                                    color: 'primary.main',
                                    padding: '8px 16px',
                                    textTransform: 'none',
                                    boxShadow: 1,
                                    backgroundColor: 'rgba(255, 255, 255, 0.6)', // light color with transparency
                                    borderRadius: '4px',
                                    transition: 'background-color 0.3s',
                                    '&:hover': {
                                      backgroundColor: 'rgba(255, 255, 255, 0.8)', // slightly less transparent on hover
                                    },
                                  }}
                                >
                                  {request.location.address}
                                </Box>
                              </TableCell>
                              <TableCell>
                                <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                                  {formatItems(request.itemList).map((item, index) => (
                                    <li key={index}>{item}</li>
                                  ))}
                                </ul>
                              </TableCell>
                              <TableCell>
                                <IconButton>
                                  <Button
                                    variant="contained"
                                    style={{ fontWeight: 'bold' }}
                                    sx={{
                                      backgroundColor: '#E7E7E7',
                                      color: '#878787',
                                      '&:hover': {
                                        backgroundColor: '#E7E7E7',
                                      },
                                    }}
                                    onClick={() => handleAssign(request.hp_id)}
                                  >
                                    Assign Rider
                                  </Button>
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      component="div"
                      count={groupedRequests[timeslotId].length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </TableContainer>
                </AccordionDetails>
              </Accordion>
            ))}
          </>
        )}
      </>
    );
  };
  

  const renderCompletedPickupsTable = () => {
    const groupByTimeslot = (completedPickups) => {
      return completedPickups.reduce((acc, pickup) => {
        const { timeslot } = pickup.home_point;
        if (!acc[timeslot.id]) {
          acc[timeslot.id] = [];
        }
        acc[timeslot.id].push(pickup);
        return acc;
      }, {});
    };

    const groupedCompletedPickups = groupByTimeslot(filteredCompletedPickups);

    return (
      <>
        {!selectedDate ? (
          <DateCards dates={completedPickupsDates} onDateClick={handleDateClick} />
        ) : completedPickups.length <= 0 ? (
          <CircularProgress></CircularProgress>
        ) : (
          <>
            {completedPickupsInfo.length === 0 ? (
              <CircularProgress></CircularProgress>
            ) : (
              <Grid
                container
                sx={{ padding: 2 }}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Grid item>
                  <Typography variant="h3">
                    {dayjs(selectedDate).format('MM / DD / YYYY')}
                  </Typography>
                  <Typography variant="h3">Time Slots</Typography>
                </Grid>
                <Grid
                  item
                  style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 25 }}
                >
                  <Grid
                    item
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <LocalShipping />
                    <Typography variant="body1">{completedPickupsInfo.pickups} Pickups</Typography>
                  </Grid>
                  <Grid
                    item
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <IconScale />
                    <Typography variant="body1">{completedPickupsInfo.kg} Kg</Typography>
                  </Grid>
                  <Grid
                    item
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <IconShirt />
                    <Typography variant="body1">{completedPickupsInfo.pieces} pieces</Typography>
                  </Grid>
                  <Grid
                    item
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <IconBook />
                    <Typography variant="body1">{completedPickupsInfo.books} Books</Typography>
                  </Grid>
                </Grid>
                
                <Grid item>
                  
                  <Button
                    variant="contained"
                    onClick={() => {
                      setSelectedDate(null);
                      setPickups([]);
                      setPickupRequests([]);
                      setCompletedPickups([]);
                      setCancelledPickups([]);
                    }}
                  >
                    <ArrowBackIosIcon /> Dates
                  </Button>
                </Grid>
              </Grid>
            )}
            {Object.keys(groupedCompletedPickups).map((timeslotId) => (
              <Accordion key={timeslotId} style={{ color: '#116378' }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel-${timeslotId}-content`}
                  id={`panel-${timeslotId}-header`}
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography>
                      <h1 style={{ margin: 0 }}>
                        {formatTime(
                          groupedCompletedPickups[timeslotId][0].home_point.timeslot.from,
                        )}
                        -{formatTime(groupedCompletedPickups[timeslotId][0].home_point.timeslot.to)}{' '}
                        ({groupedCompletedPickups[timeslotId][0].home_point.timeslot.sector.name})
                      </h1>
                      <h2 style={{ margin: 0, marginTop: 5 }}>
                        Pickups : {groupedCompletedPickups[timeslotId].length}
                      </h2>
                    </Typography>
                    {/* <Button
                      variant="contained"
                      sx={{ ml: 2 }}
                      // onClick={() => handleAssignAll(timeslotId)}
                      disabled  // assuming no assign all functionality for completed pickups
                    >
                      Assign All
                    </Button> */}
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>Driver</TableCell>
                          <TableCell>Date & Time</TableCell>
                          <TableCell>Location</TableCell>
                          <TableCell>Items</TableCell>
                          <TableCell>Credited Points</TableCell>
                          <TableCell>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {groupedCompletedPickups[timeslotId]
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .filter((pickup) =>
                            pickup.driver.name.toLowerCase().includes(searchTerm.toLowerCase()),
                          )
                          .map((pickup) => (
                            <TableRow key={pickup.home_point.hp_id}>
                              <TableCell>{pickup.home_point.hp_id}</TableCell>
                              <TableCell>{pickup.driver ? pickup.driver.name : 'N/A'}</TableCell>
                              <TableCell>
                                {formatDate(pickup.pickup_time)}
                                <br />
                                {formatDateTime(pickup.pickup_time)}
                              </TableCell>
                              <TableCell>
                                <Box
                                  onClick={() => handleLocationClick(pickup.home_point.location)}
                                  sx={{
                                    display: 'inline-block',
                                    cursor: 'pointer',
                                    color: 'primary.main',
                                    padding: '8px 16px',
                                    textTransform: 'none',
                                    boxShadow: 1,
                                    backgroundColor: 'rgba(255, 255, 255, 0.6)', // light color with transparency
                                    borderRadius: '4px',
                                    transition: 'background-color 0.3s',
                                    '&:hover': {
                                      backgroundColor: 'rgba(255, 255, 255, 0.8)', // slightly less transparent on hover
                                    },
                                  }}
                                >
                                  {pickup.location.address}
                                </Box>
                              </TableCell>
                              <TableCell>
                                <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                                  {formatItems(pickup.itemList).map((item, index) => (
                                    <li key={index}>{item}</li>
                                  ))}
                                </ul>
                              </TableCell>
                              <TableCell>{pickup.points}</TableCell>
                              <TableCell>
                                <IconButton>
                                  <Button
                                    variant="contained"
                                    style={{ fontWeight: 'bold' }}
                                    sx={{
                                      backgroundColor: '#E7E7E7',
                                      color: '#878787',
                                      '&:hover': {
                                        backgroundColor: '#E7E7E7',
                                      },
                                    }}
                                    onClick={() => handleViewCompletePickup(pickup)}
                                  >
                                    View Pickup
                                  </Button>
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      component="div"
                      count={groupedCompletedPickups[timeslotId].length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </TableContainer>
                </AccordionDetails>
              </Accordion>
            ))}
          </>
        )}
      </>
    );
  };

  const renderCancelledPickupsTable = () => {
    const groupByTimeslot = (cancelledPickups) => {
      return cancelledPickups.reduce((acc, pickup) => {
        const { timeslot } = pickup.home_point;
        if (!acc[timeslot.id]) {
          acc[timeslot.id] = [];
        }
        acc[timeslot.id].push(pickup);
        return acc;
      }, {});
    };

    const groupedCancelledPickups = groupByTimeslot(filteredCancelledPickups);

    return (
      <>
        {!selectedDate ? (
          <DateCards dates={cancelledPickupsDates} onDateClick={handleDateClick} />
        ) : (
          <>
            {cancelledPickupsInfo.length === 0 ? (
              <CircularProgress></CircularProgress>
            ) : (
              <Grid
                container
                sx={{ padding: 2 }}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Grid item>
                  <Typography variant="h3">
                    {dayjs(selectedDate).format('MM / DD / YYYY')}
                  </Typography>
                  <Typography variant="h3">Time Slots</Typography>
                </Grid>
                <Grid
                  item
                  style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 25 }}
                >
                  <Grid
                    item
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <LocalShipping />
                    <Typography variant="body1">{cancelledPickupsInfo.pickups} Pickups</Typography>
                  </Grid>
                  <Grid
                    item
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <IconScale />
                    <Typography variant="body1">{cancelledPickupsInfo.kg} Kg</Typography>
                  </Grid>
                  <Grid
                    item
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <IconShirt />
                    <Typography variant="body1">{cancelledPickupsInfo.pieces} pieces</Typography>
                  </Grid>
                  <Grid
                    item
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <IconBook />
                    <Typography variant="body1">{cancelledPickupsInfo.books} Books</Typography>
                  </Grid>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setSelectedDate(null);
                      setPickups([]);
                      setPickupRequests([]);
                      setCompletedPickups([]);
                      setCancelledPickups([]);
                    }}
                  >
                    <ArrowBackIosIcon /> Dates
                  </Button>
                </Grid>
              </Grid>
            )}
            {Object.keys(groupedCancelledPickups).map((timeslotId) => (
              <Accordion key={timeslotId} style={{ color: '#116378' }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel-${timeslotId}-content`}
                  id={`panel-${timeslotId}-header`}
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography>
                      <h1 style={{ margin: 0 }}>
                        {formatTime(
                          groupedCancelledPickups[timeslotId][0].home_point.timeslot.from,
                        )}
                        -{formatTime(groupedCancelledPickups[timeslotId][0].home_point.timeslot.to)}{' '}
                        ({groupedCancelledPickups[timeslotId][0].home_point.timeslot.sector.name})
                      </h1>
                      <h2 style={{ margin: 0, marginTop: 5 }}>
                        Pickups : {groupedCancelledPickups[timeslotId].length}
                      </h2>
                    </Typography>
                    {/* <Button
                      variant="contained"
                      sx={{ ml: 2 }}
                      // onClick={() => handleAssignAll(timeslotId)}
                      disabled  // assuming no assign all functionality for cancelled pickups
                    >
                      Assign All
                    </Button> */}
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>User Name</TableCell>
                          <TableCell>Time Slot</TableCell>
                          <TableCell>Location</TableCell>
                          <TableCell>Items</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {groupedCancelledPickups[timeslotId]
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .filter((pickup) =>
                            pickup.driver.name.toLowerCase().includes(searchTerm.toLowerCase()),
                          )
                          .map((pickup) => (
                            <TableRow key={pickup.home_point.hp_id}>
                              <TableCell>{pickup.home_point.hp_id}</TableCell>
                              <TableCell onClick={() => handleUserClicked(pickup.home_point.user)}>
                                {pickup.home_point.user ? pickup.home_point.user.name : 'N/A'}
                              </TableCell>
                              <TableCell>
                                {formatDate(pickup.home_point.timeslot.date)}
                                <br />
                                {formatTime(pickup.home_point.timeslot.from)}-
                                {formatTime(pickup.home_point.timeslot.to)}
                              </TableCell>
                              <TableCell>
                                <Box
                                  onClick={() => handleLocationClick(pickup.home_point.location)}
                                  sx={{
                                    display: 'inline-block',
                                    cursor: 'pointer',
                                    color: 'primary.main',
                                    padding: '8px 16px',
                                    textTransform: 'none',
                                    boxShadow: 1,
                                    backgroundColor: 'rgba(255, 255, 255, 0.6)', // light color with transparency
                                    borderRadius: '4px',
                                    transition: 'background-color 0.3s',
                                    '&:hover': {
                                      backgroundColor: 'rgba(255, 255, 255, 0.8)', // slightly less transparent on hover
                                    },
                                  }}
                                >
                                  {pickup.location.address}
                                </Box>
                              </TableCell>
                              <TableCell>
                                <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                                  {formatItems(pickup.home_point.itemList).map((item, index) => (
                                    <li key={index}>{item}</li>
                                  ))}
                                </ul>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      component="div"
                      count={groupedCancelledPickups[timeslotId].length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </TableContainer>
                </AccordionDetails>
              </Accordion>
            ))}
          </>
        )}
      </>
    );
  };

  return (
    <PageContainer title="Pickup Page" description="This is the pickup page">
      <Breadcrumb title="Pickup Page" items={BCrumb} />
      <DashboardCard>
        <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" sx={{ color: '#116378' }}>Pickups</Typography>
          <Box display="flex" gap={3}>
            <TextField
              placeholder="Search Here"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              style={{ flexGrow: 1 }}
              value={searchTerm}
              onChange={handleSearch}
            />
            <Button variant="contained" color="primary" onClick={handleAddPickup}>
              Add Pickup
            </Button>
            <Button
              variant="contained"
              style={{ fontWeight: 'bold' }}
              sx={{
                backgroundColor: '#E7E7E7',
                color: '#878787',
                '&:hover': {
                  backgroundColor: '#E7E7E7',
                },
              }}
              onClick={() => handleAssign(null)}
            >
              Assign Rider
            </Button>

            
              <IconButton>
                <Delete />
              </IconButton>
              <IconButton>
                <FilterAlt />
              </IconButton>
            
          </Box>
        </Box>

        <>
        <br />
        <br />
          <Box sx={{ borderBottom: 2, borderColor: 'divider', mb: 1 }}>
            <Tabs
              value={tabValue}
              onChange={(e, newValue) => {
                setSelectedDate(null);
                setPage(0);
                setTabValue(newValue);
              }}
              TabIndicatorProps={{ style: { display: 'none' } }}
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
                '.MuiTabs-flexContainer': {
                  gap: '8px',
                },
              }}
            >
              
              <Tab label="Pickups" value="0" style={{ color: '#116378' }} />
              <Tab label="Pickup Requests" value="1" style={{ color: '#116378' }} />
              <Tab label="Completed Pickups" value="2" style={{ color: '#116378' }} />
              <Tab label="Cancelled Pickups" value="3" style={{ color: '#116378' }} />
            </Tabs>
          </Box>
          <TabContext value={tabValue}>
            <TabPanel value="0" style={{ color: '#116378' }}>
              {renderPickupsTable()}
            </TabPanel>
            <TabPanel value="1" style={{ color: '#116378' }}>
              {renderPickupRequestsTable()}
            </TabPanel>
            <TabPanel value="2" style={{ color: '#116378' }}>
              {renderCompletedPickupsTable()}
            </TabPanel>
            <TabPanel value="3" style={{ color: '#116378' }}>
              {renderCancelledPickupsTable()}
            </TabPanel>
          </TabContext>
        </>
        {/* )} */}
      </DashboardCard>
      <Modal
        open={mapOpen}
        onClose={closeModal}
        aria-labelledby="location-modal-title"
        aria-describedby="location-modal-description"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            height: '80%',
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2 id="location-modal-title">Location Map</h2>
          <div id="map" style={{ width: '100%', height: '90%' }}></div>
          <Button onClick={closeModal}>Close</Button>
        </Box>
      </Modal>
    </PageContainer>
  );
};

export default Pickups;
