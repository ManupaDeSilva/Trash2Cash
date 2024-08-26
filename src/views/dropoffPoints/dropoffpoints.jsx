import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton,
  TextField, InputAdornment, Menu, MenuItem, Button
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';

const initialDropoffPoints = [
    {id: 'DOF001', name: 'Colombo Dropoff Point', location: 'No.12/A, Janapadha Mv, Colombo 01.', contact: '+9476 3241532' },
    {id: 'DOF002', name: 'Piliyandala Dropoff Point', location: 'Susith”, Vihara Mw, Piliyandala.', contact: '+9476 3212332' },
    {id: 'DOF003', name: 'Kottawa Collection Hub', location: 'No.123, Aubumola, Kottawa.', contact: '+9476 3241532' },
];

const BCrumb = [
    {
      to: '/',
      title: 'Home',
    },
    {
      title: 'Dropoff Points',
    },
  ];

  const DropoffPoints = () => {

    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [dropoffpoints] = useState(initialDropoffPoints); 
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedDropoffPoints, setselectedDropoffPoints] = useState(null);
  
    const handleSearch = (event) => {
      setSearchTerm(event.target.value);
    };
  
    const handleMoreClick = (event, dropoffpoints) => {
      setAnchorEl(event.currentTarget);
      setselectedDropoffPoints(dropoffpoints);
    };
  
    const handleMoreClose = () => {
      setAnchorEl(null);
      setselectedDropoffPoints(null);
    };

    const handleView = (id) => {
      navigate('/view-dropoffpoint'); // Navigate to view-dropoffpoint route 
      handleMoreClose(); // Close the menu after navigation
    };
  
    const handleAddDropoffpoint = () => {
      navigate('/add-dropoffpoint'); // Navigate to add-dropoffpoint route
    };
    
    return(
        <PageContainer title="Dropoff Points Page" description="this is the Dropoff Points page">
            
            {/* breadcrumb */}
            <Breadcrumb title="Dropoff Points" items={BCrumb} />

            {/* end breadcrumb */}
            <DashboardCard title="Dropoff Points">
            {/* Search Container */}
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
          <Button variant="contained" color="primary" onClick={handleAddDropoffpoint}>
            Add Dropoff Point
          </Button>
        </div>

    {/* Dropoff points Data Table */}
    <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Dropoff Point ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {dropoffpoints.map((dropoffpoint) => (
                <TableRow key={dropoffpoint.id} >
                  <TableCell onClick={() => handleView(dropoffpoint.id)} >{dropoffpoint.id}</TableCell>
                  <TableCell onClick={() => handleView(dropoffpoint.id)} >{dropoffpoint.name}</TableCell>
                  <TableCell> {dropoffpoint.location}</TableCell>
                  <TableCell> {dropoffpoint.contact}</TableCell>
                  <TableCell>
                    <IconButton aria-label="more" onClick={(e) => handleMoreClick(e, dropoffpoint)}>
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      keepMounted
                      open={Boolean(anchorEl) && selectedDropoffPoints?.id === dropoffpoint.id}
                      onClose={handleMoreClose}
                    >
                      <MenuItem onClick={() => handleView(dropoffpoint.id)}>View</MenuItem>
                    </Menu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
             </TableContainer>
         </DashboardCard>
      </PageContainer>

    );

  };

  export default DropoffPoints;
