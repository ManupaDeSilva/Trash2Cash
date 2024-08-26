import React, { useState } from 'react';
import {
    Box,
    Typography,
    Tab,
    Tabs,
} from '@mui/material';
import { TabContext } from '@mui/lab';
import Breadcrumb from '../../layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';

const rateSettings = () => {

    return (
        <Box>
            <Typography variant="h6">T2C Points Rates</Typography>

        </Box>
    )
}

export default rateSettings