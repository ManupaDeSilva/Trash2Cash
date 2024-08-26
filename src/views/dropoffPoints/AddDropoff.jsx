import React from 'react';
import { Box,Paper, Grid, Button, Typography,TextField } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from 'src/components/shared/DashboardCard';
import plasticsImage from '../../assets/images/others/plastic.svg';
import tinsImage from '../../assets/images/others/tin.svg';
import clothesImage from '../../assets/images/others/clothes.svg';
import booksImage from '../../assets/images/others/books.svg';
import papersImage from '../../assets/images/others/paper.svg';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import InputAdornment from '@mui/material/InputAdornment';


const BCrumb = [
    {
      to: '/',
      title: 'Home',
    },
    {
      to: '/',
      title: 'DropoffPoints',
    },
    {
      to:'/',
      title: 'View DropoffPoint',
    },
    {
        title: 'View Dropoff',
    },
  ];
  
const AddDropoff=()=>{


    return(
        <PageContainer title='Add New Dropoff'>
        <Breadcrumb title="Setting Page" items={BCrumb} />
        <DashboardCard title={'Add new Dropoff'}>
        <br />
            <Grid>
            <Typography variant='h6' mb={2}>Dropoff Point Name</Typography>
            <TextField fullWidth
            placeholder='Dropoff Point Name (Cannot be change)' //Add Dropoff Point Name here
            InputProps={{
                readOnly: true,
              }}
            variant='outlined'
              >  
            </TextField>
            </Grid>
            <br/>
            <Grid container spacing={8}>
              <Grid item xs={12} sm={6}>
              <Typography variant='h6' mb={2}>Customer Name</Typography>
              <TextField fullWidth
              placeholder='Enter Customer Name'>
              </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
              <Typography variant='h6' mb={2}>Contact Number</Typography>
              <TextField fullWidth
              placeholder='Enter Contact Number '
              ></TextField>
              </Grid>
            </Grid>
        
        <br/>
        <Paper elevation={3} style={{ padding: '20px', margin: '20px' }}>
          <Box display="flex" flexDirection="column" alignItems="left">
            <Typography variant="h4" gutterBottom>
              Quantities Details
            </Typography>
            <br></br>
            <br></br>
          </Box>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6} container alignItems="center">
              <img
                src={plasticsImage}
                alt=""
                style={{ width: '50px', height: '70px', marginRight: '20px', marginLeft: '250px' }}
              />
              <Typography
                variant="body1"
                style={{ marginBottom: '20px', fontWeight: 'bold', fontSize: '16px' }}
              >
                 <TextField
                sx={{width: 150}}
                variant='outlined'
                InputProps={{
                    startAdornment: <InputAdornment position="end" style={{fontWeight:'bold'}}>Kg</InputAdornment>,
                  }}
                ></TextField>
              </Typography>
            </Grid>

            <Grid item xs={12} md={6} container alignItems="center">
              <img
                src={clothesImage}
                alt=""
                style={{ width: '50px', height: '70px', marginRight: '20px', marginLeft: '200px' }}
              />
              <Typography
                variant="body2"
                style={{ marginBottom: '20px', fontWeight: 'bold', fontSize: '16px' }}
              >
                <TextField
                sx={{width: 150}}
                variant='outlined'
                InputProps={{
                    startAdornment: <InputAdornment position="end" style={{fontWeight:'bold'}}>Pieces</InputAdornment>,
                  }}
                ></TextField>
              </Typography>
            </Grid>

            <Grid item xs={12} md={6} container alignItems="center">
              <img
                src={papersImage}
                alt=""
                style={{ width: '50px', height: '70px', marginRight: '20px', marginLeft: '250px' }}
              />
              <Typography
                variant="body3"
                style={{ marginBottom: '20px', fontWeight: 'bold', fontSize: '16px' }}
              >
                <TextField
                sx={{width: 150}}
                variant='outlined'
                InputProps={{
                    startAdornment: <InputAdornment position="end" style={{fontWeight:'bold'}}>Kg</InputAdornment>,
                  }}
                ></TextField>
              </Typography>
            </Grid>

            <Grid item xs={12} md={6} container alignItems="center">
              <img
                src={booksImage}
                alt=""
                style={{ width: '50px', height: '70px', marginRight: '20px', marginLeft: '200px' }}
              />
              <Typography
                variant="body4"
                style={{ marginBottom: '20px', fontWeight: 'bold', fontSize: '16px' }}
              >
                <TextField
                sx={{width: 150}}
                variant='outlined'
                InputProps={{
                    startAdornment: <InputAdornment position="end" style={{fontWeight:'bold'}}>Books</InputAdornment>,
                  }}
                ></TextField>
              </Typography>
            </Grid>

            <Grid item xs={12} md={6} container alignItems="center">
              <img
                src={tinsImage}
                alt=""
                style={{ width: '50px', height: '70px', marginRight: '20px', marginLeft: '250px' }}
              />
              <Typography
                variant="body5"
                style={{ marginBottom: '20px', fontWeight: 'bold', fontSize: '16px' }}
              >
                <TextField
                sx={{width: 150}}
                variant='outlined'
                InputProps={{
                    startAdornment: <InputAdornment position="end" style={{fontWeight:'bold'}}>Kg</InputAdornment>,
                  }}
                ></TextField>
              </Typography>
            </Grid>
            <Grid item xs={12} container justifyContent="flex-end" alignItems="center">
          </Grid>
          </Grid>
          <Box display={'flex'} justifyContent={'center'}>
        <Button variant="contained" 
        color="primary" 
        style={{paddingLeft:'40px' , paddingRight:'40px'}}
        //onClick={}
        >
        Save
        </Button>
    </Box>
        </Paper>
        </DashboardCard>
        
        </PageContainer>
    );
};
export default AddDropoff;