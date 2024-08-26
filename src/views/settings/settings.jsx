import React, { useState } from 'react';
import {
    Box,
    Typography,
    Tab,
    Tabs,
} from '@mui/material';
import { TabContext, TabPanel } from '@mui/lab';
import Breadcrumb from '../../layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import rateSettings from './rateSettings';
import offerSetting from './offersSettings';
import addvertismentSettings from './advertisementSettings';
import FaqSettings from './faqSettings';
import timeSlotSetting from './timeSlotSettings';

const BCrumb = [
    {
        to: '/',
        title: 'Home',
    },
    {
        title: 'Settings',
    },
];

const Settings = () => {
    const [tabValue, setTabValue] = useState('0');

    return (
        <PageContainer title="Setting Page" description="This is the setting page">
            <Breadcrumb title="Setting Page" items={BCrumb} />
            <DashboardCard>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="h4">Settings</Typography>
                </Box>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 1, mt: 5 }}>
                    <Tabs
                        value={tabValue}
                        onChange={(e, newValue) => setTabValue(newValue)}
                        TabIndicatorProps={{ style: { display: 'none' } }}
                        sx={{
                            '.MuiTab-root': {
                                transition: 'background-color 0.3s',
                                borderRadius: '10px',
                                marginBottom: 2,
                                flex: 1, // Ensure each tab takes equal width
                                textAlign: 'center', // Center align the text within the tab
                            },
                            '.Mui-selected': {
                                backgroundColor: 'grey.300',
                            },
                            '.MuiTabs-flexContainer': {
                                justifyContent: 'space-between', // Spread tabs evenly across the width
                            },
                        }}
                    >
                        <Tab label="Rates" value="0" style={{ color: '#116378' }} />
                        <Tab label="Offers" value="1" style={{ color: '#116378' }} />
                        <Tab label="Advertisements" value="2" style={{ color: '#116378' }} />
                        <Tab label="Time Slot" value="3" style={{ color: '#116378' }} />
                        <Tab label="FAQs" value="4" style={{ color: '#116378' }} />
                        <Tab label="Barcodes" value="5" style={{ color: '#116378' }} />
                    </Tabs>
                </Box>
                <TabContext value={tabValue}>
                    <TabPanel value="0" style={{ color: '#116378' }}>{rateSettings()}</TabPanel>
                    <TabPanel value="1" style={{ color: '#116378' }}>{offerSetting()}</TabPanel>
                    <TabPanel value="2" style={{ color: '#116378' }}>{addvertismentSettings()}</TabPanel>
                    <TabPanel value="3" style={{ color: '#116378' }}>{timeSlotSetting()}</TabPanel>
                    <TabPanel value="4" style={{ color: '#116378' }}>{FaqSettings()}</TabPanel> 
                </TabContext>
            </DashboardCard>
        </PageContainer>
    );
}

export default Settings;
