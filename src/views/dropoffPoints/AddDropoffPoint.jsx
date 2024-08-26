import React, { useState } from 'react';
import {
    Typography, Grid, Button, Box, TextField, InputAdornment
} from '@mui/material';
import DashboardCard from '../../components/shared/DashboardCard';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';


const BCrumb = [
    {
      to: '/',
      title: 'Home',
    },
    {
      to: '/dropoffPoints',
      title: 'Dropoff Points',
    },
    {
      title: 'Add Dropoff Point',
    },
  ];


const AddDropoffPoint = ()=>{

    const [form, setForm] = useState({
        name: '',
        phoneNumber: '',
        address: '',
    });

    const [formErrors, setFormErrors] = useState({
        name: '',
        phoneNumber: '',
        address: '',
    });

    // Handle form input changes
    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm({
            ...form,
            [name]: value,
        });
    };

    

return(
    <PageContainer title="Add Dropoff Point" description="Add a Dropoff Point page">
    {/* breadcrumb */}
    <Breadcrumb title="Add Dropoff Point" items={BCrumb} />
    {/* end breadcrumb */}

    <DashboardCard title="Add New Dropoff Point">
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={4}>
                            <Typography variant="subtitle1">Dropoff Point Name</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <TextField
                                fullWidth
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                margin="normal"
                                placeholder="Dropoff Point Name"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                          <LocationOnIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                error={!!formErrors.name}
                                helperText={formErrors.name}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <Typography variant="subtitle1">Phone Number</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <TextField
                                fullWidth
                                name="phoneNumber"
                                value={form.phoneNumber}
                                onChange={handleChange}
                                margin="normal"
                                placeholder="0712345678"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PhoneIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                error={!!formErrors.phoneNumber}
                                helperText={formErrors.phoneNumber}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <Typography variant="subtitle1">Address</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <TextField
                                fullWidth
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                margin="normal"
                                placeholder="123 Main St, City, Country"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <HomeIcon />
                                        </InputAdornment>
                                        
                                    ),
                                }}
                                error={!!formErrors.address}
                                helperText={formErrors.address}
                            />
                            <Button  onClick={'./'}>
                            Choose location on map
                        </Button>
                        </Grid>
                    </Grid>
                    <br/>
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
                        <Button variant="contained" color="primary" onClick={'./'}>
                            Submit
                        </Button>
                    </Box>
                    <br/>
                </DashboardCard>
        </PageContainer>
);

};

export default AddDropoffPoint;
