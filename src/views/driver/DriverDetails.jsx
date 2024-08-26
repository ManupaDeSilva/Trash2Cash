import React, { useState } from 'react';
import {
  Box,
  Tab,
  Tabs,
  Typography,
  Divider,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { FilterAlt, Delete } from '@mui/icons-material';
import Breadcrumb from '../../layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import { useNavigate } from 'react-router-dom';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Driver',
  },
];

const DriverDetails = () => {
  
  const [selectedMainTab, setSelectedMainTab] = useState(0);
  const [selectedSubTab, setSelectedSubTab] = useState(0);

  const navigate = useNavigate();

  const handleMainTabChange = (event, newValue) => {
    setSelectedMainTab(newValue);
  };

  const handleSubTabChange = (event, newValue) => {
    setSelectedSubTab(newValue);
  };

  const data = [
    { id: 'BID001', name: 'Sunil Perera', date: '02/01/2024', address: 'No 156/2 Piliyandala' },
    { id: 'BID002', name: 'Susil Perera', date: '02/01/2024', address: 'No 156/2 Piliyandala' },
    { id: 'BID003', name: 'Nimal Perera', date: '02/01/2024', address: 'No 156/2 Piliyandala' },
    { id: 'BID004', name: 'Amal Perera', date: '02/01/2024', address: 'No 156/2 Piliyandala' },
    { id: 'BID005', name: 'Kamal Perera', date: '02/01/2024', address: 'No 156/2 Piliyandala' },
  ];

  return (
    <PageContainer title="Driver Details" description="This is the Driver Details">
      <Breadcrumb title="Driver Details" items={BCrumb} />
      <DashboardCard>
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
            label="Personal Details"
            sx={{
              minWidth: 100,
              backgroundColor: selectedMainTab === 0 ? 'primary.light' : 'white',
              color: selectedMainTab === 0 ? 'white' : '#116378',
              borderRadius: '4px',
              mx: 1,
            }}
          />
          <Tab
            label="Assign Picks"
            sx={{
              minWidth: 100,
              backgroundColor: selectedMainTab === 1 ? 'primary.light' : 'white',
              color: selectedMainTab === 1 ? 'white' : '#116378',
              borderRadius: '4px',
              mx: 1,
            }}
          />
          <Tab
            label="Driver History"
            sx={{
              minWidth: 100,
              backgroundColor: selectedMainTab === 2 ? 'primary.light' : 'white',
              color: selectedMainTab === 2 ? 'white' : '#116378',
              borderRadius: '4px',
              mx: 1,
            }}
          />
        </Tabs>
        <br />
        <Divider sx={{ marginTop: 2 }} /> {/* Add a horizontal line */}
        {selectedMainTab === 0 && (
          <Box>
            <br />
            {/* <CalendarComponent /> */}
          </Box>
        )}
        {selectedMainTab === 1 && (
          <Box>
            <br />
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>
                Assign Pickups
              </Typography>
              <Box><IconButton>
                  <Delete />
                </IconButton>
                <IconButton>
                  <FilterAlt />
                </IconButton>
                
              </Box>
            </Box>
            <br />
            <Tabs
              value={selectedSubTab}
              onChange={handleSubTabChange}
              indicatorColor="grey.300"
              textColor="primary"
              sx={{
                '& .MuiTabs-flexContainer': { gap: 12 },
                marginLeft: '0', // adjust margin as needed
                
              }}
            >
              <Tab
                label="Monday"
                sx={{
                  minWidth: 100,
                  backgroundColor: selectedSubTab === 0 ? 'grey.300' : 'white',
                  color: selectedSubTab === 0 ? 'white' : 'black',
                  borderRadius: '2px',
                  mx: 1,
                }}
              />
              <Tab
                label="Tuesday"
                sx={{
                  minWidth: 100,
                  backgroundColor: selectedSubTab === 1 ? 'grey.300' : 'white',
                  color: selectedSubTab === 1 ? 'white' : 'black',
                  borderRadius: '2px',
                  mx: 1,
                }}
              />
              <Tab
                label="Wednesday"
                sx={{
                  minWidth: 100,
                  backgroundColor: selectedSubTab === 2 ? 'primary.light' : 'white',
                  color: selectedSubTab === 2 ? 'white' : 'black',
                  borderRadius: '2px',
                  mx: 1,
                }}
              />
              <Tab
                label="Thursday"
                sx={{
                  minWidth: 100,
                  backgroundColor: selectedSubTab === 3 ? 'primary.light' : 'white',
                  color: selectedSubTab === 3 ? 'white' : 'black',
                  borderRadius: '2px',
                  mx: 1,
                }}
              />
              <Tab
                label="Friday"
                sx={{
                  minWidth: 100,
                  backgroundColor: selectedSubTab === 4 ? 'primary.light' : 'white',
                  color: selectedSubTab === 4 ? 'white' : 'black',
                  borderRadius: '2px',
                  mx: 1,
                }}
              />
            </Tabs>
            {selectedSubTab === 0 && (
              <TableContainer component={Paper} sx={{ mt: 0, backgroundColor: 'grey.300', borderRadius: '2px', marginLeft: "8px"}}>
                <Table>
                  <TableHead>
                    
                  </TableHead>
                  <TableBody>
                    {data.map((row) => (
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
            )}
             {selectedSubTab === 1 && (
              <TableContainer component={Paper} sx={{ mt: 0, backgroundColor: 'grey.300', borderRadius: '2px', marginLeft: "8px"}}>
                <Table>
                  <TableHead>
                    
                  </TableHead>
                  <TableBody>
                    {data.map((row) => (
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
            )}
          </Box>
        )}
        {selectedMainTab === 2 && (
          <Box>
            <br />
            {/* Content for Driver History */}
          </Box>
        )}
      </DashboardCard>
    </PageContainer>
  );
};

export default DriverDetails;
