import React from 'react';
import { Typography } from '@mui/material';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Home',
  },
];

const Home = () => {
  return (
    <PageContainer title="Home Page" description="this is Home page">
      {/* breadcrumb */}
      <Breadcrumb title="Home Page" items={BCrumb} />
      {/* end breadcrumb */}
      <DashboardCard title="Home Page">
        <Typography>Under Construction...</Typography>
      </DashboardCard>
    </PageContainer>
  );
};

export default Home;
