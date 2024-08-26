import React, { useState } from 'react';
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
  Checkbox,
  Box,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import { Delete } from '@mui/icons-material';
import FilterListIcon from '@mui/icons-material/FilterList';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    to: '/',
    title: 'Driver',
  },
  {
    to: '/',
    title: 'Driver Details',
  },
  {
    title: 'Driver Pickup History',
  },
];

const DriverPickupHistory = () => {

  // Example Data
  const PickupsHistoryList = [
    { id: 'P001', name: 'Sarath Perera', dateTime: '20/06/2024 12.15 pm ', location: 'No.12/A, Janapadha Mv, Kottawa.', contact: '+94713645218', status: 'Completed' },
    { id: 'P002', name: 'Alex Perera', dateTime: '20/06/2024 12.15 pm ', location: 'No.12/A, Janapadha Mv, Kottawa.', contact: '+94713645218', status: 'Completed' },
    { id: 'P003', name: 'Dunith Perera', dateTime: '20/06/2024 12.15 pm ', location: 'No.12/A, Janapadha Mv, Kottawa.', contact: '+94713645218', status: 'Completed' },
    { id: 'P005', name: 'Tharindu Perera', dateTime: '20/06/2024 12.15 pm ', location: 'No.12/A, Janapadha Mv, Kottawa.', contact: '+94713645218', status: 'Not Completed' },
    { id: 'P005', name: 'Ramindu Chandrapala', dateTime: '20/06/2024 12.15 pm ', location: 'No.12/A, Janapadha Mv, Kottawa.', contact: '+94713645218', status: 'Completed' },
    { id: 'P007', name: 'Sarath Chandrapala', dateTime: '20/06/2024 12.15 pm ', location: 'No.12/A, Janapadha Mv, Kottawa.', contact: '+94713645218', status: 'Not completed' }
  ];

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredPickups = PickupsHistoryList.filter((pickup) =>
    pickup.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageContainer>
      <Breadcrumb title="Offload Points" items={BCrumb} />
      <DashboardCard>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <TextField
            placeholder="Search..."
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
            style={{ flexGrow: 1, marginRight: '16px' }}
            value={searchTerm}
            onChange={handleSearch}
          />
          <Box display={'flex'} gap={4} ml={4}>
            <FilterListIcon />
            <Delete />
          </Box>
        </div>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><Checkbox /></TableCell>
                <TableCell>Pickup ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Date & Time</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPickups.map((pickup) => (
                <TableRow key={pickup.id} style={{height:'80px'}}>
                  <TableCell><Checkbox/></TableCell>
                  <TableCell>{pickup.id}</TableCell>
                  <TableCell>{pickup.name}</TableCell>
                  <TableCell>{pickup.dateTime}</TableCell>
                  <TableCell>{pickup.location}</TableCell>
                  <TableCell>{pickup.contact}</TableCell>
                  <TableCell style={{color:'green', fontWeight:'bold'}}>{pickup.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DashboardCard>
    </PageContainer>
  );
};

export default DriverPickupHistory;
