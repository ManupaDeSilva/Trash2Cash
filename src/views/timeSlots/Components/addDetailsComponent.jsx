import React, { useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useNavigate } from 'react-router';



const AddDetailsComponent = ({sector,date}) => {
  const navigate = useNavigate();

  const handleAddTimeslots = () => {
    navigate('/addTime',{state: {date,sector}})
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      style={{ paddingTop: '150px', paddingRight: '100px' }}
    >
      <Box
        onClick={handleAddTimeslots}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 50,
          height: 50,
          borderRadius: '50%',
          backgroundColor: '#ccc',
        }}
      >
        <AddIcon sx={{ fontSize: 35, color: '#116378' }} />
      </Box>
      <br />
      <Box mt={1} onClick={handleAddTimeslots}>
        <Typography sx={{ fontSize: 18, color: '#116378', fontWeight: 'bold' }}>
          Add Details
        </Typography>
      </Box>
    </Box>
  );
};

export default AddDetailsComponent;
