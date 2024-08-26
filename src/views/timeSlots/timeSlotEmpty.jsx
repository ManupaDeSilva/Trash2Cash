import React, { useState } from 'react';
import { Box, Tab, Tabs, Grid } from '@mui/material';
import Breadcrumb from '../../layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import CalendarComponent from './Components/calender'; // importing calender cpomponent to reduce code size
import 'leaflet/dist/leaflet.css';
import AddDetailsComponent from './Components/addDetailsComponent'; // importing addIcon cpomponent to reduce code size

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Time Slots',
  },
];

const TimeSlotsEmpty = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <PageContainer title="Time Slots" description="This is the Time Slots">
      <Breadcrumb title="Time Slots" items={BCrumb} />
      <DashboardCard>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
          sx={{ '& .MuiTabs-flexContainer': { gap: 6 } }} // Adding gap between tabs
        >
          <Tab
            label="Location 01"
            sx={{
              minWidth: 100,
              backgroundColor: selectedTab === 0 ? 'primary.light' : 'white',
              color: selectedTab === 0 ? 'white' : 'black',
              borderRadius: '4px',
              mx: 1,
            }}
          />
          <Tab
            label="Location 02"
            sx={{
              minWidth: 100,
              backgroundColor: selectedTab === 1 ? 'primary.light' : 'white',
              color: selectedTab === 1 ? 'white' : 'black',
              borderRadius: '4px',
              mx: 1,
            }}
          />
          <Tab
            label="Location 03"
            sx={{
              minWidth: 100,
              backgroundColor: selectedTab === 2 ? 'primary.light' : 'white',
              color: selectedTab === 2 ? 'white' : 'black',
              borderRadius: '4px',
              mx: 1,
            }}
          />
          <Tab
            label="Location 04"
            sx={{
              minWidth: 100,
              backgroundColor: selectedTab === 3 ? 'primary.light' : 'white',
              color: selectedTab === 3 ? 'white' : 'black',
              borderRadius: '4px',
              mx: 1,
            }}
          />
          <Tab
            label="Location 05"
            sx={{
              minWidth: 100,
              backgroundColor: selectedTab === 4 ? 'primary.light' : 'white',
              color: selectedTab === 4 ? 'white' : 'black',
              borderRadius: '4px',
              mx: 1,
            }}
          />
        </Tabs>
        <Grid container spacing={1} sx={{ p: 2 }}>
          <Grid item xs={12} md={6}>
            <Box>
              {selectedTab === 0 && (
                <Box>
                  <br />
                  <br />
                  <CalendarComponent />
                </Box>
              )}
              {selectedTab === 1 && (
                <Box>
                  <br />
                  <br />
                  <CalendarComponent />
                </Box>
              )}
              {selectedTab === 2 && (
                <Box>
                  <br />
                  <br />
                  <CalendarComponent />
                </Box>
              )}
              {selectedTab === 3 && (
                <Box>
                  <br />
                  <br />
                  <CalendarComponent />
                </Box>
              )}
              {selectedTab === 4 && (
                <Box>
                  <br />
                  <br />
                  <CalendarComponent />
                </Box>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box>
              <br />
              <br />
              {selectedTab === 0 && <AddDetailsComponent />}
              {selectedTab === 1 && <AddDetailsComponent />}
              {selectedTab === 2 && <AddDetailsComponent />}
              {selectedTab === 3 && <AddDetailsComponent />}
              {selectedTab === 4 && <AddDetailsComponent />}
            </Box>
          </Grid>
        </Grid>
      </DashboardCard>
    </PageContainer>
  );
};

export default TimeSlotsEmpty;
