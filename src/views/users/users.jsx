import React, { useState } from 'react';
import {
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Grid,
  TextField,
  Button,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Avatar,
} from '@mui/material';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Users',
  },
];

const columns = [
  { id: 'id', label: 'User ID & Name', minWidth: 150 },
  // { id: 'userIdAndName', label: '', minWidth: 150 },
  { id: 'availablePoints', label: 'Credits Remaining', minWidth: 150, align: 'right' },
  { id: 'redeemed', label: 'Redeemed', minWidth: 100, align: 'right' },
  { id: 'lastOnline', label: 'Last Active', minWidth: 150 },
  { id: 'mobile', label: 'Contact', minWidth: 130 },
  { id: 'allTimePoints', label: 'All-Time Points', minWidth: 150, align: 'right' },
  { id: 'action', label: 'Action', minWidth: 160, align: 'center' },
];

const ActionMenu = ({ row, onEdit, onView }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleClose();
    onEdit(row);
  };

  const handleView = () => {
    handleClose();
    onView(row);
  };

  return (
    <>
      <IconButton
        aria-controls={open ? 'action-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="action-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'action-button',
        }}
      >
        <MenuItem onClick={handleView}>View</MenuItem>
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
      </Menu>
    </>
  );
};

const Users = () => {
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('id');

  const username = 'root';
  const password = 't2c';
  const imagePath = 'https://t2cimg.shieldtechnologies.xyz';

  const encodedCredentials = btoa(`${username}:${password}`);

  const fetchUsers = async () => {
    const response = await axios.get(
      'http://ec2-18-143-176-53.ap-southeast-1.compute.amazonaws.com:8080/api/users',
      {
        headers: {
          Authorization: `Basic ${encodedCredentials}`,
        },
      },
    );

    return response.data.map((user) => ({
      id: user.user_id,
      userIdAndName: `${user.name}`,
      pfpLink: `${user.pfpLink}`,
      availablePoints: user.available_points,
      redeemed: user.pointSummary.redeem,
      lastOnline: user.last_online,
      mobile: user.mobile,
      allTimePoints: user.pointSummary.machine + user.pointSummary.dropoff + user.pointSummary.home,
      ...user,
    }));
  };

  const {
    data = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['usersData'],
    queryFn: fetchUsers,
  });

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleViewClick = (user) => {
    setSelectedUser(user);
    navigate(`/user/details/${user.id}`, { state: { user } });
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    navigate(`/user/edit`, {
      state: {
        userId: user.user_id,
        name: user.name,
        email: user.email,
        phone: user.mobile,
        pfp_link: user.pfpLink,
      },
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
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

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedData = data.sort((a, b) => {
    if (orderBy) {
      if (a[orderBy] < b[orderBy]) {
        return order === 'asc' ? -1 : 1;
      }
      if (a[orderBy] > b[orderBy]) {
        return order === 'asc' ? 1 : -1;
      }
      return 0;
    }
    return 0;
  });

  const filteredData = sortedData.filter((user) =>
    user.userIdAndName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <PageContainer title="Users Details" description="this is Users page">
      <Breadcrumb title="Users Details" items={BCrumb} />
      <DashboardCard title="Users Page">
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
          <Button variant="contained" color="primary" onClick={() => navigate(`/user/add`)}>
            Add user
          </Button>
        </div>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                    sortDirection={orderBy === column.id ? order : false}
                  >
                    {column.id !== 'action' ? (
                      <TableSortLabel
                        active={orderBy === column.id}
                        direction={orderBy === column.id ? order : 'asc'}
                        onClick={(event) => handleRequestSort(event, column.id)}
                      >
                        {column.label}
                      </TableSortLabel>
                    ) : (
                      column.label
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.id === 'id' ? (
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}
                              xs={1}
                            >
                              <Avatar src={`${imagePath}/${row['pfpLink']}`} />
                              <div style={{ margin: 5 }}>
                                <h2 style={{ margin: 0, marginBottom: 4 }}>UID{value}</h2>
                                {row['userIdAndName']}
                              </div>
                            </div>
                          ) : column.id === 'mobile' ? (
                            formatPhoneNumber(value)
                          ) : column.id === 'lastOnline' ? (
                            formatDateTime(value)
                          ) : column.id === 'action' ? (
                            <>
                              <ActionMenu
                                row={row}
                                onEdit={handleEditClick}
                                onView={handleViewClick}
                              />
                            </>
                          ) : (
                            value
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </DashboardCard>
    </PageContainer>
  );
};

export default Users;
