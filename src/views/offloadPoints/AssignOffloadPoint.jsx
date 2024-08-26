import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Grid,
  Button,
  FormControlLabel,
  Checkbox,
  Autocomplete,
  Alert,
} from '@mui/material';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router';
import assignImage from '../../assets/images/others/assignRider.png';

const AssignOffloadPoint = () => {
  const { offloadId } = useParams(); // Extract from URL
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [offloadDate, setOffloadDate] = useState('');
  const [checkedItems, setCheckedItems] = useState({
    glassBottles: false,
    tetraPacks: false,
    clothes: false,
    papers: false,
    books: false,
  });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'success' });

  const username = 'root';
  const password = 't2c';
  const encodedCredentials = btoa(`${username}:${password}`);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await axios.get(
          'http://ec2-18-143-176-53.ap-southeast-1.compute.amazonaws.com:8080/api/drivers',
          {
            headers: {
              Authorization: `Basic ${encodedCredentials}`,
            },
          },
        );
        setDrivers(response.data);
      } catch (error) {
        console.error('Error fetching drivers:', error);
      }
    };

    fetchDrivers();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    const today = new Date().toISOString().split('T')[0];

    if (!selectedDriver) {
      newErrors.driver = 'Driver is required';
    }

    if (!offloadDate) {
      newErrors.date = 'Offload date is required';
    } else if (offloadDate < today) {
      newErrors.date = 'Offload date cannot be in the past';
    }

    if (!Object.values(checkedItems).includes(true)) {
      newErrors.items = 'At least one item must be selected';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const data = {
      driver: {
        driver_id: selectedDriver.driver_id,
      },
      selectedItem: {
        pct: checkedItems.tetraPacks ? 1 : 0,
        papers: checkedItems.papers ? 1 : 0,
        gbottles: checkedItems.glassBottles ? 1 : 0,
        books: checkedItems.books ? 1 : 0,
        clothes: checkedItems.clothes ? 1 : 0,
      },
      offloadLocations: {
        id: offloadId,
      },
    };

    try {
      const response = await axios.post(
        'http://ec2-18-143-176-53.ap-southeast-1.compute.amazonaws.com:8080/api/offload-points',
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${encodedCredentials}`,
          },
        },
      );

      const { message, successful } = response.data;
      setAlert({ show: true, message, severity: successful ? 'success' : 'error' });

      setTimeout(() => {
        navigate('/offloadpoints');
      }, 2000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setAlert({ show: true, message: 'Error submitting form', severity: 'error' });
    }
  };

  const handleCheckboxChange = (event) => {
    setCheckedItems({
      ...checkedItems,
      [event.target.name]: event.target.checked,
    });
  };

  return (
    <Box m={3}>
      <Typography variant="h4">Assign Offload Point</Typography>
      <Typography
      fullWidth
      display={'flex'}
      justifyContent={'center'}
      height={'280px'}
      >
        <img src={assignImage}></img>
      </Typography>

      <Box mt={3}>
        {alert.show && <Alert severity={alert.severity}>{alert.message}</Alert>}
        <Autocomplete
          options={drivers}
          getOptionLabel={(option) => option.name}
          value={selectedDriver}
          onChange={(event, newValue) => setSelectedDriver(newValue)}
          inputValue={searchText}
          onInputChange={(event, newInputValue) => setSearchText(newInputValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select a Driver"
              variant="outlined"
              fullWidth
              margin="normal"
              error={!!errors.driver}
              helperText={errors.driver}
            />
          )}
        />
        <TextField
          label="Offload Date"
          type="date"
          variant="outlined"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          value={offloadDate}
          onChange={(event) => setOffloadDate(event.target.value)}
          error={!!errors.date}
          helperText={errors.date}
        />
     
        {errors.items && (
          <Typography color="error" variant="body2">
            {errors.items}
          </Typography>
        )}
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            position="relative"
            style={{ marginTop: '20px'}}
            >
        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: '20px', width: '200px' }}
          onClick={handleSubmit}
        >
          Assign
        </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AssignOffloadPoint;
