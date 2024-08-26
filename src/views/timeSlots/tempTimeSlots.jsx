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
  Menu,
  MenuItem,
  Button,
  Box,
  Tabs,
  Tab,
  Pagination,
  Grid,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Timeslot',
  },
];

const Timeslot = () => {
  const navigate = useNavigate();
  const [tabIndex, setTabIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTimeslot, setSelectedTimeslot] = useState(null);
  const [timeslots, setTimeslots] = useState([]);
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('date');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const itemsPerPage = 5;
  const username = 'root';
  const password = 't2c';
  const encodedCredentials = btoa(`${username}:${password}`);

  const fetchTimeslots = async () => {
    const response = await axios.get(
      'http://ec2-18-143-176-53.ap-southeast-1.compute.amazonaws.com:8080/api/timeslots',
      {
        headers: {
          Authorization: `Basic ${encodedCredentials}`,
        },
      },
    );
    return response.data;
  };

  const {
    data: fetchedTimeslots = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['timeslots'],
    queryFn: fetchTimeslots,
  });

  const formatTime = (pickupTime) => {
    if (!pickupTime) return 'N/A'; // Handle null or undefined cases
    const [hours, minutes, seconds] = pickupTime.split(':');
    const dateObj = new Date();
    dateObj.setHours(hours);
    dateObj.setMinutes(minutes);
    dateObj.setSeconds(seconds);
    return dateObj.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  const formatDate = (date) => {
    return dayjs(date).format('MM/DD/YYYY');
  };

  useEffect(() => {
    setTimeslots(fetchedTimeslots);
  }, [fetchedTimeslots]);

  const validateForm = (formValues) => {
    const errors = {};
    if (!formValues.date) errors.date = 'Date is required';
    if (!formValues.from) errors.from = 'From time is required';
    if (!formValues.to) errors.to = 'To time is required';
    if (!formValues.max) errors.max = 'Max value is required';
    return errors;
  };

  useEffect(() => {
    console.log(selectedTimeslot);
  }, [selectedTimeslot]);

  const handleAddTimeslot = async () => {
    const formValues = {
      date: document.getElementById('date-field').value,
      from: document.getElementById('from-field').value,
      to: document.getElementById('to-field').value,
      max: document.getElementById('max-field').value,
    };
    const errors = validateForm(formValues);
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      const response = await axios.post(
        'http://ec2-18-143-176-53.ap-southeast-1.compute.amazonaws.com:8080/api/timeslots',
        {
          date: formValues.date,
          from: formValues.from,
          to: formValues.to,
          max: formValues.max,
        },
        {
          headers: {
            Authorization: `Basic ${encodedCredentials}`,
          },
        },
      );
      console.log(response.data);
      refetch();
      console.log('Form is valid, add the timeslot');
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleMoreClick = (event, timeslot) => {
    setAnchorEl(event.currentTarget);
    setSelectedTimeslot(timeslot);
  };

  const handleMoreClose = () => {
    setAnchorEl(null);
    setSelectedTimeslot(null);
  };

  const handleView = () => {
    setEditMode(false); // Ensure edit mode is set to false for view mode
    setDialogOpen(true); // Open the dialog
  };

  const handleEdit = () => {
    setEditMode(true); // Set edit mode to true
    setDialogOpen(true); // Open the dialog
  };

  const handleDeletePrompt = () => {
    setDeleteDialogOpen(true);
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    console.log(selectedTimeslot);
    if (selectedTimeslot) {
      try {
        const response = await axios.delete(
          `http://ec2-18-143-176-53.ap-southeast-1.compute.amazonaws.com:8080/api/timeslots/${selectedTimeslot.id}`,
          {
            headers: {
              Authorization: `Basic ${encodedCredentials}`,
            },
          },
        );
        refetch();
        console.log(response.data);
        setDeleteDialogOpen(false);
        setSelectedTimeslot(null);
      } catch (error) {
        console.error('Error deleting timeslot:', error);
      }
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedTimeslots = timeslots.slice().sort((a, b) => {
    if (order === 'asc') {
      return a[orderBy] < b[orderBy] ? -1 : 1;
    }
    return a[orderBy] > b[orderBy] ? -1 : 1;
  });

  const filteredTimeslots = sortedTimeslots.filter(
    (timeslot) =>
      timeslot.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formatTime(timeslot.from).toLowerCase().includes(searchTerm.toLowerCase()) ||
      formatTime(timeslot.to).toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const displayedTimeslots = filteredTimeslots.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  return (
    <PageContainer title="Timeslot Page" description="This is the Timeslot page">
      <Breadcrumb title="Timeslot" items={BCrumb} />
      <DashboardCard title="Timeslot">
        <Tabs value={tabIndex} onChange={(e, newIndex) => setTabIndex(newIndex)}>
          <Tab label="View Timeslot" />
          <Tab label="Add Timeslot" />
        </Tabs>

        {tabIndex === 1 && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              mb: 3,
              mt: 3,
            }}
          >
            <Grid container spacing={2} maxWidth="md">
              <Grid item xs={12} sm={6}>
                <TextField
                  id="date-field"
                  fullWidth
                  label="Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  error={!!formErrors.date}
                  helperText={formErrors.date}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="from-field"
                  fullWidth
                  label="From"
                  type="time"
                  InputLabelProps={{ shrink: true }}
                  error={!!formErrors.from}
                  helperText={formErrors.from}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="to-field"
                  fullWidth
                  label="To"
                  type="time"
                  InputLabelProps={{ shrink: true }}
                  error={!!formErrors.to}
                  helperText={formErrors.to}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="max-field"
                  fullWidth
                  label="Max"
                  type="number"
                  InputLabelProps={{ shrink: true }}
                  error={!!formErrors.max}
                  helperText={formErrors.max}
                />
              </Grid>
            </Grid>
            <Button variant="contained" color="primary" onClick={handleAddTimeslot}>
              Add Timeslot
            </Button>
          </Box>
        )}

        {tabIndex === 0 && (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <TextField
                placeholder="Search by date or time..."
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
              <Button variant="contained" color="primary" onClick={() => setTabIndex(1)}>
                Add Timeslot
              </Button>
            </Box>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell onClick={() => handleSort('id')}>ID</TableCell>
                    <TableCell onClick={() => handleSort('date')}>Date</TableCell>
                    <TableCell onClick={() => handleSort('from')}>From</TableCell>
                    <TableCell onClick={() => handleSort('to')}>To</TableCell>
                    <TableCell onClick={() => handleSort('max')}>Max</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayedTimeslots.map((timeslot) => (
                    <TableRow key={timeslot.id}>
                      <TableCell>{timeslot.id}</TableCell>
                      <TableCell>{formatDate(timeslot.date)}</TableCell>
                      <TableCell>{formatTime(timeslot.from)}</TableCell>
                      <TableCell>{formatTime(timeslot.to)}</TableCell>
                      <TableCell>{timeslot.max}</TableCell>
                      <TableCell>
                        <IconButton onClick={(event) => handleMoreClick(event, timeslot)}>
                          <MoreVertIcon />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)}
                          onClose={handleMoreClose}
                        >
                          <MenuItem onClick={handleView}>View</MenuItem>
                          <MenuItem onClick={handleEdit}>Edit</MenuItem>
                          <MenuItem onClick={handleDeletePrompt}>Delete</MenuItem>
                        </Menu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Pagination
              count={Math.ceil(filteredTimeslots.length / itemsPerPage)}
              page={page}
              onChange={handlePageChange}
              sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}
            />
          </>
        )}
      </DashboardCard>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>{editMode ? 'Edit Timeslot' : 'View Timeslot'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                id="edit-date-field"
                fullWidth
                label="Date"
                type="date"
                value={selectedTimeslot ? selectedTimeslot.date : ''}
                InputLabelProps={{ shrink: true }}
                InputProps={{ readOnly: !editMode }}
                error={!!formErrors.date}
                helperText={formErrors.date}
                onChange={(event) => {
                  setSelectedTimeslot({
                    ...selectedTimeslot,
                    date: event.target.value, // Update the date value in selectedTimeslot
                  });
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="edit-from-field"
                fullWidth
                label="From"
                type="time"
                value={selectedTimeslot ? selectedTimeslot.from : ''}
                InputLabelProps={{ shrink: true }}
                InputProps={{ readOnly: !editMode }}
                error={!!formErrors.from}
                helperText={formErrors.from}
                onChange={(event) => {
                  setSelectedTimeslot({
                    ...selectedTimeslot,
                    from: event.target.value, // Update the date value in selectedTimeslot
                  });
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="edit-to-field"
                fullWidth
                label="To"
                type="time"
                value={selectedTimeslot ? selectedTimeslot.to : ''}
                InputLabelProps={{ shrink: true }}
                InputProps={{ readOnly: !editMode }}
                error={!!formErrors.to}
                helperText={formErrors.to}
                onChange={(event) => {
                  setSelectedTimeslot({
                    ...selectedTimeslot,
                    to: event.target.value, // Update the date value in selectedTimeslot
                  });
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="edit-max-field"
                fullWidth
                label="Max"
                type="number"
                value={selectedTimeslot ? selectedTimeslot.max : ''}
                InputLabelProps={{ shrink: true }}
                InputProps={{ readOnly: !editMode }}
                error={!!formErrors.max}
                helperText={formErrors.max}
                onChange={(event) => {
                  setSelectedTimeslot({
                    ...selectedTimeslot,
                    max: event.target.value, // Update the date value in selectedTimeslot
                  });
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          {editMode ? (
            <>
              <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button
                onClick={async () => {
                  const formValues = {
                    date: document.getElementById('edit-date-field').value,
                    from: document.getElementById('edit-from-field').value,
                    to: document.getElementById('edit-to-field').value,
                    max: document.getElementById('edit-max-field').value,
                  };
                  const errors = validateForm(formValues);
                  setFormErrors(errors);

                  if (Object.keys(errors).length === 0) {
                    const response = await axios.put(
                      `http://ec2-18-143-176-53.ap-southeast-1.compute.amazonaws.com:8080/api/timeslots/${selectedTimeslot.id}`,
                      {
                        date: formValues.date,
                        from: formValues.from,
                        to: formValues.to,
                        max: formValues.max,
                      },
                      {
                        headers: {
                          Authorization: `Basic ${encodedCredentials}`,
                        },
                      },
                    );
                    console.log(response.data);
                    refetch();
                    console.log('Form is valid, save the timeslot');
                    setDialogOpen(false);
                  }
                }}
                color="primary"
              >
                Save
              </Button>
            </>
          ) : (
            <Button onClick={() => setDialogOpen(false)}>Close</Button>
          )}
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Timeslot</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this timeslot?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default Timeslot;
