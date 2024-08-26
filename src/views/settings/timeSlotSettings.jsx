import React, { useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Button,
    TableCell,
    TableRow,
    TableHead,
    TableBody,
    Table,
    TextField,
    TableContainer,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const TimeSlotSetting = () => {
  const [timeSlots, setTimeSlots] = useState([
    { id: 1, startTime: '', endTime: '', maxPickups: 10 },
    { id: 2, startTime: '', endTime: '', maxPickups: 10 },
  ]);

  const addNewTimeSlot = () => {
    const newTimeSlot = {
      id: timeSlots.length + 1,
      startTime: '',
      endTime: '',
      maxPickups: 10,
    };
    setTimeSlots([...timeSlots, newTimeSlot]);
  };

  return (
    <PageContainer title="Time Slots Settings" description="This is the Time Slot Setting page">     
      <Box mb={2}>
        <Typography mt={1} variant="h6">Pre-Defined Time slots</Typography>
        <Typography mt={'5px'} style={{color:'GrayText'}}>Pre defined time slots makes it easier to assign time slots to dates</Typography>
      </Box>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <TableContainer style={{ width: '80%' }}>
          <Table sx={{ minWidth: 300 }} style={{ width: '80%' }} > 
            <TableHead>
              <TableRow>
                <TableCell style={{ fontSize: '14px', fontWeight: 'bold' }}>
                  Time Slots
                </TableCell>
                <TableCell></TableCell>
                <TableCell style={{ fontSize: '14px', fontWeight: 'bold' }}>
                  Max Pickups
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {timeSlots.map((timeSlot) => (
                <TableRow key={timeSlot.id}>
                  <TableCell style={{
                    padding: '8px',
                    fontSize: '10px',
                  }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <TextField
                        variant="outlined"
                        size="small"
                        value={timeSlot.startTime}
                        onChange={(e) => {
                          const updatedSlots = timeSlots.map(slot => 
                            slot.id === timeSlot.id ? { ...slot, startTime: e.target.value } : slot
                          );
                          setTimeSlots(updatedSlots);
                        }}
                        style={{ marginRight: 5 }}
                        InputProps={{
                          style: { textAlign: 'center' },
                        }}
                      />
                      <Typography sx={{ mx: 1 }}>-</Typography>
                      <TextField
                        variant="outlined"
                        size="small"
                        value={timeSlot.endTime}
                        onChange={(e) => {
                          const updatedSlots = timeSlots.map(slot => 
                            slot.id === timeSlot.id ? { ...slot, endTime: e.target.value } : slot
                          );
                          setTimeSlots(updatedSlots);
                        }}
                        InputProps={{
                          style: { textAlign: 'center' },
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell style={{
                    padding: '40px',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}> 
                  </TableCell>
                  <TableCell>
                  <Typography>{timeSlot.maxPickups}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <br />
      <DashboardCard>
        <Box display={'flex'} justifyContent={'center'}>
          <Button style={{ padding: '12px' }} onClick={addNewTimeSlot}>
            <Box display={'flex'} justifyContent={'center'} flexDirection={'row'} gap={1}>
              <AddCircleIcon />
              <Typography variant="h6">Add New Time Slot</Typography>
            </Box>
          </Button>
        </Box>
      </DashboardCard>
    </PageContainer>
  );
};

export default TimeSlotSetting;
