import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Typography, Grid, Paper, TextField, IconButton, Button, Menu, MenuItem, Checkbox, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, InputAdornment } from '@mui/material';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from 'src/components/shared/DashboardCard';
import truckImage from '../../assets/images/others/OffloadTruck.png';
import plasticsImage from '../../assets/images/others/plastic.svg';
import tinsImage from '../../assets/images/others/tin.svg';
import clothesImage from '../../assets/images/others/clothes.svg';
import booksImage from '../../assets/images/others/books.svg';
import papersImage from '../../assets/images/others/paper.svg';

 
{/*Example data*/}
const dropoffItemList = [
  {id:'1', image: booksImage ,quantity: '10 Books', price: '50.00/Book', amount: 500.10 },        
  {id:'2', image: clothesImage , quantity: '10 Pieces', price: '50.00/Book', amount: 1000.00},    
  {id:'3', image: plasticsImage , quantity: '10 Kg', price: '50.00/Book', amount: 200.00 },         
  {id:'4', image: papersImage , quantity: '10 Kg', price: '50.00/Book', amount:500.00 },            
  {id:'5', image: tinsImage , quantity: '15 Kg', price: '50.00/Book', amount: 150.00 },            
  
];


const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    to: '/',
    title: 'Dropoff Points',
  },
  {
    to: '/',
    title: 'View Dropoff Point',
  },
  {
    title: 'Dropoff Details',
  },

];

const ViewDropoff = ({ onBack }) => {

    const getTotalAmount = () => {
        return dropoffItemList.reduce((total, dropoffItem) => {
          return total + dropoffItem.amount;
        }, 0);
      }
      const totalAmount = getTotalAmount();

    return (
        <PageContainer title="Dropoff Details" description="This is Dropoff details page">
        {/* breadcrumb */}
        <Breadcrumb title="Dropoff Details" items={BCrumb} />
        {/* end breadcrumb */}
        <DashboardCard>
        <Box display={'flex'} justifyContent={'space-between'}>
            <Typography variant='h5'mb={3} color={'#116378'}>Dropoff Details ({/*Add Dropoff ID here*/})</Typography>
            <Button onClick={onBack}
                variant="contained" 
                color="primary" 
                >Back
             </Button>
        </Box>
        <Box display="flex" flexDirection="column" alignItems="center">
        </Box>
        <br></br>
        <Box>
        <Grid>
            <Typography variant='h6' mb={2}>Dropofff ID</Typography>
            <TextField
                placeholder='DID 001' // dropoff id show here
                variant="outlined"
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />
        </Grid>
        <br></br>
        <Grid>
            <Typography variant='h6' mb={2}>Customer Name</Typography>
            <TextField
                placeholder='Customer Name' // customer name show here
                variant="outlined"
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />
        </Grid>     
        <br></br>
        <Grid>
            <Typography variant='h6' mb={2}>Date and Time</Typography>
            <TextField
                placeholder='25/05/2024   11.35 am' //date and time show here 
                variant="outlined"
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>     
            </Box>      
        </DashboardCard>
        <br></br>
        {/*Offload offload item details*/}
        <Paper elevation={3} style={{ padding: '20px', margin: '20px' }}>
        <Box display="flex" flexDirection="column" alignItems="left">
            <Typography variant="h4" gutterBottom color={'#116378'}>
              Dropoff Item Details
            </Typography>
          </Box>
        <TableContainer component={Paper}>
        <Table>
            <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell style={{fontWeight:'bold'}}>Items</TableCell>
              <TableCell style={{fontWeight:'bold'}}>Quantities</TableCell>
              <TableCell style={{fontWeight:'bold'}}>Price per Unit (LKR)</TableCell>
              <TableCell style={{fontWeight:'bold'}}>Amount (LKR)</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
                {dropoffItemList.map((dropoffItem) => (
                  <TableRow key={dropoffItem.id}>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell><img src={dropoffItem.image} alt={`dropoffItem ${dropoffItem.id}`} width="50" /></TableCell>
                    <TableCell>{dropoffItem.quantity}</TableCell>
                    <TableCell>{dropoffItem.price}</TableCell>
                    <TableCell style={{fontWeight:'bold'}}>{dropoffItem.amount.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell style={{fontWeight:'bold'}}>Total Amount (LKR)</TableCell>
                  <TableCell style={{fontWeight:'bold'}}>{totalAmount.toFixed(2)}</TableCell>
                </TableRow>
              </TableBody>
        </Table>
        </TableContainer>
        </Paper>

    </PageContainer>
  );
      
}
export default ViewDropoff;
