import React from 'react';
import { Typography } from '@mui/material';
import PageContainer from '../../components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';

const AssignPickup = () => {
  return (
    <PageContainer title="Assign Pickup Page" description="This is the assign pickup page">
      <DashboardCard title="Assign Pickup">
        <Typography>Assign Pickup Details...</Typography>
      </DashboardCard>
    </PageContainer>
  );
};

export default AssignPickup;
