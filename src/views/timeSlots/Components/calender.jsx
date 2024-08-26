import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { LocalizationProvider, DateCalendar } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const CalendarComponent = ({ onSelectDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleDateChange = (date) => {
    setCurrentDate(date);
    onSelectDate(date);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box boxShadow={3} p={2} borderRadius={4} style={{ width: '70%', margin: '0 auto' }}>
        <DateCalendar
          value={currentDate}
          onChange={handleDateChange}
          disableFuture={false}
          disablePast={false}
          sx={{
            borderRadius: '8px',
            '.MuiPickersDay-root': {
              borderRadius: '20px',
              '&:hover': {
                backgroundColor: '#e3f2fd',
              },
            },
            '.Mui-selected': {
              backgroundColor: '#116378 !important',
              color: 'white',
            },
            '.MuiPickersCalendarHeader-label': {
              fontSize: '1.25rem',
            },
            '.MuiPickersArrowSwitcher-root': {
              display: 'flex',
              justifyContent: 'space-between',
              '.MuiIconButton-root': {
                color: '#FF7A00',
              },
            },
            '.MuiPickersArrowSwitcher-button': {
              color: '#FF7A00',
            },
          }}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default CalendarComponent;
