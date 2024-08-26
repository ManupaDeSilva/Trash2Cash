import React, { useState, useEffect } from 'react';
import {
  Typography,
  TextField,
  Box,
  Divider,
  IconButton,
  Collapse,
  FormControl,
  FormLabel,
  Table,
  CardContent,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Button,
  Tabs,
  Tab,
  Grid,
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

import { FilterList, Delete, ExpandMore, ExpandLess } from '@mui/icons-material';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import {Poll} from '@mui/icons-material';
import axios from 'axios';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Offload Points',
  },
];

// Function to format dates for grouping
const formatDateGroup = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();

  if (date.toDateString() === now.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === new Date(now.setDate(now.getDate() - 1)).toDateString()) {
    return 'Yesterday';
  } else {
    return new Intl.DateTimeFormat('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    }).format(date);
  }
};

const formatSelectedItems = (selectedItem) => {
  let items = [];
  if (selectedItem.pct) items.push('PCT');
  if (selectedItem.papers) items.push('Papers');
  if (selectedItem.gbottles) items.push('Glass Bottles');
  if (selectedItem.books) items.push('Books');
  if (selectedItem.clothes) items.push('Clothes');
  return items.join(', ');
};

// Function to format dates for table cell
const formatDateCell = (dateString) => {
  if (dateString == null) {
    return 'Not Completed Yet';
  } else {
    const date = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffMinutes < 60) {
      return `${diffMinutes} minutes ago`;
    } else if (now.toDateString() === date.toDateString()) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    } else if (now.toDateString() === new Date(now.setDate(now.getDate() - 1)).toDateString()) {
      return 'Yesterday';
    } else {
      return new Intl.DateTimeFormat('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }).format(date);
    }
  }
};

const fetchOffloads = async (offloadId) => {
  const username = 'root';
  const password = 't2c';
  const encodedCredentials = btoa(`${username}:${password}`);

  const response = await axios.get(
    `http://ec2-18-143-176-53.ap-southeast-1.compute.amazonaws.com:8080/api/offload-points/location/${offloadId}`,
    {
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
      },
    },
  );

  return response.data;
};

const Viewoffloadpoints = () => {
  
  const [selectedMainTab, setSelectedMainTab] = useState(0);
  const handleMainTabChange = (event, newValue) => {
    setSelectedMainTab(newValue);
  };

  const location = useLocation();
  const { selectedOffloadPoints } = location.state;
  const { offloadId } = useParams();
  const navigate = useNavigate();

  const [groupedData, setGroupedData] = useState({});
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const getOffloads = async () => {
      const offloads = await fetchOffloads(offloadId);
      const grouped = offloads.reduce((acc, curr) => {
        const dateKey = formatDateGroup(curr.date);
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(curr);
        return acc;
      }, {});
      setGroupedData(grouped);
    };

    getOffloads();
  }, [offloadId]);

  const handleExpandClick = (date) => {
    setExpanded((prev) => ({ ...prev, [date]: !prev[date] }));
  };

  const handleViewOffload = (offload) => {
    navigate(`/view-offload`, { state: { offload } });
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
  
  const defaultColor = '#369b98';
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
    <PageContainer title="Offload Points" description="This is the offload points page">
      <Breadcrumb title="Offload Points Page" items={BCrumb} />
      
      <DashboardCard>
      
      <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
      Offload Point ID : {selectedOffloadPoints.id}
     </div>
     <Typography variant="subtitle1" style={{color: '#116378',fontWeight:'bold',paddingTop:'10px'}}>{selectedOffloadPoints.name}</Typography>
      <br></br>
    <>
    <Box sx={{ borderBottom: 2, borderColor: 'divider', mb: 1 }}>
    <Tabs
          value={selectedMainTab}
          onChange={handleMainTabChange}
          indicatorColor="primary"
          textColor="primary"
          sx={{
            '& .MuiTabs-flexContainer': { gap: 12 },
            marginLeft: '0', // adjust margin as needed
          }}
        >
          <Tab
            label="Offload Point"
            sx={{
              minWidth: 100,
              backgroundColor: selectedMainTab === 0 ? 'primary.light' : 'white',
              color: selectedMainTab === 0 ? 'white' : '#116378',
              borderRadius: '4px',
              mx: 1,
            }}
          />
          <Tab
            label="Offload History"
            sx={{
              minWidth: 100,
              backgroundColor: selectedMainTab === 1 ? 'primary.light' : 'white',
              color: selectedMainTab === 1 ? 'white' : '#116378',
              borderRadius: '4px',
              mx: 1,
            }}
          />
          <Tab
            label="Offload Summary"
            sx={{
              minWidth: 100,
              backgroundColor: selectedMainTab === 2 ? 'primary.light' : 'white',
              color: selectedMainTab === 2 ? 'white' : '#116378',
              borderRadius: '4px',
              mx: 1,
            }}
          />
        </Tabs>
       
        <Divider sx={{ marginTop: 2 }} /> {/* Add a horizontal line */}
        <br></br>

        
{/* This is the offloadpoint details tab*/}
        {selectedMainTab === 0 && (
          <Box>
            <Box display={'Flex'} justifyContent={'space-between'}> 
            <h3 style={{color: '#116378'}}>Offload Point Details</h3>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to={`/assign-offloadpoint/${offloadId}`}
            ><span style={{paddingLeft:'30px'}}></span>
              Assign
            <span style={{paddingLeft:'30px'}}></span>
            </Button>
            </Box>
              <Grid item xs={12} sm={6}>
                      <FormControl fullWidth margin="dense">
                        <FormLabel style={{fontWeight:'bold', paddingBottom:'10px'}}>Offload Point Name</FormLabel>
                        <TextField
                         value={selectedOffloadPoints.name}
                          variant="outlined"
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </FormControl>
              </Grid>
              <br></br>
              <Grid item xs={12} sm={6}>
                      <FormControl fullWidth margin="dense">
                        <FormLabel style={{fontWeight:'bold', paddingBottom:'10px'}}>Address</FormLabel> 
                        <TextField
                        value={'Add Address here'} //Add address here
                        variant="outlined"
                        InputProps={{
                          readOnly: true,
                        }}
                        />
                      </FormControl>
              </Grid>
              <br></br>
              <Grid item xs={12} sm={6}>
                      <FormControl fullWidth margin="dense">
                        <FormLabel style={{fontWeight:'bold', paddingBottom:'10px'}}>Contact Number</FormLabel> 
                        <TextField
                        value={'Add Contact Number here'} //Add Contact Number here
                        variant="outlined"
                        InputProps={{
                          readOnly: true,
                        }}
                        />
                      </FormControl>
              </Grid>
           
          </Box>
        )}
{/* This is the offload history tab*/}
{selectedMainTab === 1 && (
        <Box>
        <br />
        <>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            position="relative"
            style={{ marginTop: '20px' }}
          >
            <Typography variant="h4" style={{color: '#116378'}}>Offload History</Typography>
            <Box position="absolute" right={0} >
              <IconButton>
                <FilterList />
              </IconButton>
              <span style={{paddingLeft:'25px'}}></span>
              <IconButton>
                <Delete />
              </IconButton>
              <span style={{paddingLeft:'30px'}}></span>
             
            </Box>
          </Box>
              {Object.keys(groupedData).map((date) => (
                <Box key={date} style={{ marginTop: '20px' }}>
                  <Box display="flex" alignItems="center">
                    <IconButton onClick={() => handleExpandClick(date)}>
                      {expanded[date] ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                    <Typography variant="h5">{date}</Typography>
                  </Box>
                  <Typography variant="h6" ml={'40px'} mb={'20px'} style={{color:'#116378'}}>Customers :<span>  1</span></Typography> {/* Add sum of customers in each row*/}
                  <Divider sx={{ marginTop: 2 }} />
                  <Collapse in={expanded[date]} timeout="auto" unmountOnExit>
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell></TableCell> 
                            <TableCell>ID</TableCell>
                            <TableCell>Driver Name</TableCell>
                            <TableCell>Items</TableCell>
                            <TableCell>Date & Time</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {groupedData[date].map((offload) => (
                            <TableRow key={offload.id} onClick={() => handleViewOffload(offload)}>
                              <TableCell>
                                <Checkbox />
                              </TableCell>
                              <TableCell>{offload.id}</TableCell>
                              <TableCell>{offload.driver.name}</TableCell>
                              <TableCell>{formatSelectedItems(offload.selectedItem)}</TableCell>
                              <TableCell>{formatDateCell(offload.offloadTime)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Collapse>
                </Box>
             ))}
         </>  
      </Box>
   )}


{/* This is the offload summary tab*/}
{selectedMainTab === 2 && (
  <>
   <Typography variant='h4' color={'#116378'}>Total Offloads Weekly</Typography>
   <br></br>
  <Grid container spacing={1} sx={{ mt: 1 }} gap={'57px'}>  
      {/*Chart for Clothes*/}
          <Box width= "30%">
            <DashboardCard title="Clothes" subtitle="This week" >
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
                <Grid width="100%" container spacing={1} sx={{ mt: 1 }}>
                  <Grid item xs={6} container alignItems="center">
                    <Poll sx={{ fontSize: 20, marginRight: -2 }} />
                    <CardContent>
                      <Typography >Offloads</Typography>
                      <Typography >82</Typography>
                    </CardContent>
                  </Grid>
                  <Grid item xs={6} container alignItems="center">
                    <Poll sx={{ fontSize: 20, marginRight: -2 }} />
                    <CardContent>
                      <Typography >This Week</Typography>
                      <Typography >10</Typography>
                    </CardContent>
                  </Grid>
                </Grid>
              </DashboardCard>
          </Box>

           {/*Chart for Glass Bottles*/}
          <Box width= "30%">
            <DashboardCard title="Glass Bottles" subtitle="This week" >
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
                <Grid width="100%" container spacing={1} sx={{ mt: 1 }}>
                  <Grid item xs={6} container alignItems="center">
                    <Poll sx={{ fontSize: 20, marginRight: -2 }} />
                    <CardContent>
                      <Typography >Offloads</Typography>
                      <Typography >82</Typography>
                    </CardContent>
                  </Grid>
                  <Grid item xs={6} container alignItems="center">
                    <Poll sx={{ fontSize: 20, marginRight: -2 }} />
                    <CardContent>
                      <Typography >This Week</Typography>
                      <Typography >10</Typography>
                    </CardContent>
                  </Grid>
                </Grid>
              </DashboardCard>
          </Box>

           {/*Chart for Paper Waste*/}
          <Box width= "30%">
            <DashboardCard title="Paper Waste" subtitle="This week" >
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
                <Grid width="100%" container spacing={1} sx={{ mt: 1 }}>
                  <Grid item xs={6} container alignItems="center">
                    <Poll sx={{ fontSize: 20, marginRight: -2 }} />
                    <CardContent>
                      <Typography >Offloads</Typography>
                      <Typography >82</Typography>
                    </CardContent>
                  </Grid>
                  <Grid item xs={6} container alignItems="center">
                    <Poll sx={{ fontSize: 20, marginRight: -2 }} />
                    <CardContent>
                      <Typography >This Week</Typography>
                      <Typography >10</Typography>
                    </CardContent>
                  </Grid>
                </Grid>
              </DashboardCard>
          </Box>
        </Grid>

        <Grid container spacing={1} sx={{ mt: 3 }} gap={'57px'}>
           
           {/*Chart for Books*/}
           <Box width= "30%">
            <DashboardCard title="Books" subtitle="This week" >
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
                <Grid width="100%" container spacing={1} sx={{ mt: 1 }}>
                  <Grid item xs={6} container alignItems="center">
                    <Poll sx={{ fontSize: 20, marginRight: -2 }} />
                    <CardContent>
                      <Typography >Offloads</Typography>
                      <Typography >82</Typography>
                    </CardContent>
                  </Grid>
                  <Grid item xs={6} container alignItems="center">
                    <Poll sx={{ fontSize: 20, marginRight: -2 }} />
                    <CardContent>
                      <Typography >This Week</Typography>
                      <Typography >10</Typography>
                    </CardContent>
                  </Grid>
                </Grid>
              </DashboardCard>
          </Box>

           {/*Chart for Tetra Cans */}
          <Box width= "30%">
            <DashboardCard title="Tetra Cans" subtitle="This week" >
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
                <Grid width="100%" container spacing={1} sx={{ mt: 1 }}>
                  <Grid item xs={6} container alignItems="center">
                    <Poll sx={{ fontSize: 20, marginRight: -2 }} />
                    <CardContent>
                      <Typography >Offloads</Typography>
                      <Typography >82</Typography>
                    </CardContent>
                  </Grid>
                  <Grid item xs={6} container alignItems="center">
                    <Poll sx={{ fontSize: 20, marginRight: -2 }} />
                    <CardContent>
                      <Typography >This Week</Typography>
                      <Typography >10</Typography>
                    </CardContent>
                  </Grid>
                </Grid>
              </DashboardCard>
          </Box>
        </Grid>
      </>
      )}
  </Box>
</>

       </DashboardCard>
    </PageContainer>
  );
};

export default Viewoffloadpoints;
