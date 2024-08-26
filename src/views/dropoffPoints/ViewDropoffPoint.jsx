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
  { to: '/', title: 'Home' },
  { title: 'Dropoff Points' },
];

const ViewDropoffPoints = () => {
  const [selectedMainTab, setSelectedMainTab] = useState(0);
  const handleMainTabChange = (event, newValue) => setSelectedMainTab(newValue);
  const navigate = useNavigate();
  const [groupedData, setGroupedData] = useState({});
  const [expanded, setExpanded] = useState({});

  const handleExpandClick = (date) => {
    setExpanded((prev) => ({ ...prev, [date]: !prev[date] }));
  };

  const mockdropoff = [
    { id: 'OFO01', driverName: 'Sarath Perera', items: 'Glass Bottles, Tetra Packs, Clothes', dateTime: '02/01/2024 08:32 AM' },
    { id: 'OFO02', driverName: 'Kumara Silva', items: 'Clothes, Glass Bottles', dateTime: '02/01/2024 08:32 AM' },
    { id: 'OFO01', driverName: 'Chandrapala Fernando', items: 'Books, Glass Bottles, Paper Waste', dateTime: '02/01/2024 08:32 AM' },
  ];

  useEffect(() => {
    // Group the dropoff data by date
    const grouped = mockdropoff.reduce((acc, dropoff) => {
      const date = dropoff.dateTime.split(' ')[0];
      if (!acc[date]) acc[date] = [];
      acc[date].push(dropoff);
      return acc;
    }, {});
    setGroupedData(grouped);
  }, []);


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
    <PageContainer title="View DropoffPoints" description="This is the dropoff point view page">
      <Breadcrumb title="View Dropoff Point" items={BCrumb} />
      <DashboardCard>
        <Box display={'flex'} justifyContent={'space-between'}>
        <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
          Dropoff Point Name :{/*Dropoff Name view here*/}
        </div>
        <Button
              variant="contained"
              color="primary"
              component={Link}
              to={'/add-dropoff'}
              // to={/*add dropoff */}
            ><span style={{paddingLeft:'30px'}}></span>
              Add Dropoff
            <span style={{paddingLeft:'30px'}}></span>
            </Button>
        </Box>
        <Typography variant="subtitle1" style={{ color: '#116378', fontWeight: 'bold'}}>
          Dropoff Point ID : {/*Dropoff Point ID show up here */}
        </Typography>
        <br />
        <Box sx={{ borderBottom: 2, borderColor: 'divider', mb: 1 }}>
          <Tabs
            value={selectedMainTab}
            onChange={handleMainTabChange}
            indicatorColor="primary"
            textColor="primary"
            sx={{ '& .MuiTabs-flexContainer': { gap: 12 }, marginLeft: '0' }}
          >
            <Tab
              label="Dropoff Point"
              sx={{
                minWidth: 100,
                backgroundColor: selectedMainTab === 0 ? 'primary.light' : 'white',
                color: selectedMainTab === 0 ? 'white' : '#116378',
                borderRadius: '4px',
                mx: 1,
              }}
            />
            <Tab
              label="Dropoff History"
              sx={{
                minWidth: 100,
                backgroundColor: selectedMainTab === 1 ? 'primary.light' : 'white',
                color: selectedMainTab === 1 ? 'white' : '#116378',
                borderRadius: '4px',
                mx: 1,
              }}
            />
            <Tab
              label="Dropoff Summary"
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
          <br />
          {selectedMainTab === 0 && (
            <Box>
              <h3 style={{ color: '#116378' }}>Dropoff Point Details</h3>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="dense">
                  <FormLabel style={{ fontWeight: 'bold', paddingBottom: '10px' }}>Dropoff Point Name</FormLabel>
                  <TextField
                    value={'name'}
                    variant="outlined"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </FormControl>
              </Grid>
              <br />
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="dense">
                  <FormLabel style={{ fontWeight: 'bold', paddingBottom: '10px' }}>Address</FormLabel>
                  <TextField
                    value={'Add Address here'} //Add address here
                    variant="outlined"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </FormControl>
              </Grid>
              <br />
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="dense">
                  <FormLabel style={{ fontWeight: 'bold', paddingBottom: '10px' }}>Contact Number</FormLabel>
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
{/*This is DropoffPoint History Tab*/}
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
                  <Typography variant="h4" style={{ color: '#116378' }}>Dropoff History</Typography>
                  <Box position="absolute" right={0}>
                    <IconButton>
                      <FilterList />
                    </IconButton>
                    <span style={{ paddingLeft: '25px' }}></span>
                    <IconButton>
                      <Delete />
                    </IconButton>
                    <span style={{ paddingLeft: '30px' }}></span>
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
                    <Typography variant="h6" ml={'40px'} mb={'20px'} style={{ color: '#116378' }}>Customers : <span> {groupedData[date].length} </span></Typography>
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
                            {groupedData[date].map((dropoff) => (
                              <TableRow key={dropoff.id} component={Link} to="/view-dropoff">
                                <TableCell><Checkbox /></TableCell>
                                <TableCell>{dropoff.id}</TableCell>
                                <TableCell>{dropoff.driverName}</TableCell>
                                <TableCell>{dropoff.items}</TableCell>
                                <TableCell>{dropoff.dateTime}</TableCell>
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

{/* This is the Dropoff summary tab*/}
{selectedMainTab === 2 && (
  <>
   <Typography variant='h4' color={'#116378'}>Total Dropoffs Weekly</Typography>
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
                      <Typography >Dropoffs</Typography>
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
                      <Typography >Dropoffs</Typography>
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
                      <Typography >Dropoffs</Typography>
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
                      <Typography >Dropoffs</Typography>
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
                      <Typography >Dropoffs</Typography>
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
      </DashboardCard>
    </PageContainer>
  );
};

export default ViewDropoffPoints;
