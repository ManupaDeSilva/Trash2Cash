import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Menu,
  MenuItem,
  Avatar,
} from '@mui/material';
import { Search, FilterList, AccountCircle, MoreVert } from '@mui/icons-material';
import Breadcrumb from '../../layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import dayjs from 'dayjs';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Driver',
  },
];

const Driver = () => {
  const navigate = useNavigate();
  const [anchorEls, setAnchorEls] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  const username = 'root';
  const imagePath = 'https://t2cimg.shieldtechnologies.xyz';
  const password = 't2c';

  // Encode credentials to Base64
  const encodedCredentials = btoa(`${username}:${password}`);

  const fetchUsers = async () => {
    const response = await axios.get(
      'http://ec2-18-143-176-53.ap-southeast-1.compute.amazonaws.com:8080/api/drivers',
      {
        headers: {
          Authorization: `Basic ${encodedCredentials}`,
        },
      },
    );

    return response.data;
  };

  // Use react-query to fetch drivers data
  const {
    data = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['driversData'],
    queryFn: fetchUsers,
  });

  const handleMenuOpen = (event, id) => {
    setAnchorEls({ ...anchorEls, [id]: event.currentTarget });
  };

  const capitalize = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const formatDateTime = (date) => {
    return dayjs(date).format('MM/DD/YYYY hh:mm A');
  };

  const formatPhoneNumber = (phoneNumber) => {
    // Remove leading '+' or '94'
    phoneNumber = phoneNumber.replace(/^\+?(94)?/, '0');

    // Format with spaces
    return phoneNumber.replace(/(\d{3})(\d{2})(\d{4})/, ' $1 $2 $3');
  };

  const handleMenuClose = (id) => {
    setAnchorEls({ ...anchorEls, [id]: null });
  };

  return (
    <PageContainer title="Drivers Details" description="this is Home page">
      <Breadcrumb title="Drivers Details" items={BCrumb} />
      <DashboardCard title="">
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <TextField
            placeholder="Search..."
            variant="outlined"
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton>
                    <Search />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            style={{ flexGrow: 1, marginRight: '16px' }}
          />

          <InputAdornment position="end">
            <IconButton>
              <FilterList />
            </IconButton>
          </InputAdornment>

          <Button variant="contained" color="primary" onClick={() => navigate('/driver/add')}>
            Add Driver
          </Button>
        </div>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Driver ID & Name</TableCell>
                {/* <TableCell>Assign Pickup</TableCell> */}
                <TableCell>Last Active</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data
                .filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((row) => (
                  <TableRow
                    key={row.driver_id}
                    onClick={() => navigate('/driver/profile', { state: { driver: row } })}
                  >
                    <TableCell>
                      <div
                        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
                        xs={1}
                      >
                        <Avatar alt="Remy Sharp" src={`${imagePath}/${row.pfp_link}`} />
                        <div style={{ margin: 5 }}>
                          <h2 style={{ margin: 0, marginBottom: 4 }}>DID{row.driver_id}</h2>
                          {row.name}
                        </div>
                      </div>
                    </TableCell>
                    {/* <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => navigate(`/assign-a-rider?driver_id=${row.driver_id}`)}
                    >
                      Assign Pickup
                    </Button>
                  </TableCell> */}
                    <TableCell>{formatDateTime(row.last_online)}</TableCell>
                    <TableCell>{formatPhoneNumber(row.mobile)}</TableCell>
                    <TableCell>{capitalize(row.driverStatus.status)}</TableCell>
                    <TableCell>
                      <IconButton
                        aria-controls={`action-menu-${row.driver_id}`}
                        aria-haspopup="true"
                        onClick={(event) => handleMenuOpen(event, row.driver_id)}
                      >
                        <MoreVert />
                      </IconButton>
                      <Menu
                        id={`action-menu-${row.driver_id}`}
                        anchorEl={anchorEls[row.driver_id]}
                        open={Boolean(anchorEls[row.driver_id])}
                        onClose={() => handleMenuClose(row.driver_id)}
                      >
                        <MenuItem
                          onClick={() => () => {
                            handleMenuClose(row.driver_id);
                            navigate(`/assign-a-rider?driver_id=${row.driver_id}`);
                          }}
                        >
                          Assign PickUp
                        </MenuItem>
                        <MenuItem
                          onClick={() => () => {
                            handleMenuClose(row.driver_id);
                            navigate('/driver/profile', { state: { driver: row } });
                          }}
                        >
                          View
                        </MenuItem>
                        <MenuItem
                          onClick={() => () => {
                            handleMenuClose(row.driver_id);
                            navigate('/driver/edit', { state: { driver: row } });
                          }}
                        >
                          Edit
                        </MenuItem>
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

export default Driver;
