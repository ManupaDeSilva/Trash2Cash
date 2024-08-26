import React, { useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Button,
} from '@mui/material';
import PageContainer from '../../components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import Switch from '@mui/material/Switch';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddFAQ from './addFAQ';
import { useNavigate } from 'react-router-dom';

const FaqSettings = () => {
  const [showAddFAQ, setShowAddFAQ] = useState(false);
  const navigate = useNavigate();

  const handleAddFAQClick = () => {
    setShowAddFAQ(true);
  };

  const handleBackClick = () => {
    setShowAddFAQ(false);
  };

  return (
    <PageContainer>
      {showAddFAQ ? (
        <AddFAQ onBack={handleBackClick} />
      ) : (
        <>
          <Box>
            <Typography variant="h6">All FAQs</Typography>
          </Box>
          <br />
          {/* Card for one question */}
          <DashboardCard>
            <Grid
              container
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box display={'flex'} gap={1}>
                <Typography fontWeight={'bold'}>:</Typography>
                <Typography fontWeight={'bold'}>How to redeem T2C points?</Typography>
              </Box>
              <Box display={'flex'} gap={4}>
                <Switch />
                <BorderColorIcon  color="action"/>
                <DeleteIcon color="action" />
              </Box>
            </Grid>
          </DashboardCard>
          <br />
          <DashboardCard>
            <Grid
              container
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box display={'flex'} gap={1}>
                <Typography fontWeight={'bold'}>:</Typography>
                <Typography fontWeight={'bold'}>What are the home collection areas?</Typography>
              </Box>
              <Box display={'flex'} gap={4}>
                <Switch checked={true} />
                <BorderColorIcon color="action"/>
                <DeleteIcon color="action"/>
              </Box>
            </Grid>
          </DashboardCard>
          <br />
          <DashboardCard>
            <Grid
              container
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box display={'flex'} gap={1}>
                <Typography fontWeight={'bold'}>:</Typography>
                <Typography fontWeight={'bold'}>How to redeem T2C points?</Typography>
              </Box>
              <Box display={'flex'} gap={4}>
                <Switch checked={true} />
                <BorderColorIcon color="action"/>
                <DeleteIcon color="action" 
                />
              </Box>
            </Grid>
          </DashboardCard>
          <br />
          {/* Add new Timeslot field */}
          <DashboardCard>
            <Box display={'flex'} justifyContent={'center'}>
              <Button style={{ padding: '12px' }} onClick={handleAddFAQClick}>
                <Box display={'flex'} justifyContent={'center'} flexDirection={'row'} gap={1}>
                  <AddCircleIcon />
                  <Typography variant="h6">Add a New FAQ</Typography>
                </Box>
              </Button>
            </Box>
          </DashboardCard>
        </>
      )}
    </PageContainer>
  );
};

export default FaqSettings;
