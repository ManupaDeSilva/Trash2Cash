import React from 'react';
import { useLocation } from 'react-router-dom';
import { Typography, Grid, Paper, TextField, Button, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from 'src/components/shared/DashboardCard';
import truckImage from '../../assets/images/others/OffloadTruck.png';
import plasticsImage from '../../assets/images/others/plastic.svg';
import tinsImage from '../../assets/images/others/tin.svg';
import clothesImage from '../../assets/images/others/clothes.svg';
import booksImage from '../../assets/images/others/books.svg';
import papersImage from '../../assets/images/others/paper.svg';

const offloaditemslist = [
  {id: '1', image: booksImage, quantity: '10 Books', price: '50.00/Book', amount: 500.10},        
  {id: '2', image: clothesImage, quantity: '10 Pieces', price: '50.00/Book', amount: 1000.00},    
  {id: '3', image: plasticsImage, quantity: '10 Kg', price: '50.00/Book', amount: 200.00},         
  {id: '4', image: papersImage, quantity: '10 Kg', price: '50.00/Book', amount: 500.00},            
  {id: '5', image: tinsImage, quantity: '15 Kg', price: '50.00/Book', amount: 150.00},            
];

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    to: '/offloadpoints',
    title: 'Offload Points',
  },
  {
    to: '/view-offloadpoint',
    title: 'Offload Point',
  },
  {
    title: 'Offload Details',
  },
];

const ViewOffload = () => {
  const location = useLocation();
  const { offload } = location.state;

  const OffloadDeatils = {
    id: offload.id,
    driverName: offload.driver.name,
    dateTime: '02/01/2024 08:32 AM',
    reciept: 'download the reciept',
  };

  const getTotalAmount = () => {
    return offloaditemslist.reduce((total, offloadItem) => {
      return total + offloadItem.amount;
    }, 0);
  }
  const totalAmount = getTotalAmount();

  return (
    <PageContainer title="Offload Details" description="This is offload details page">
      <Breadcrumb title="Offload Details" items={BCrumb} />
      <DashboardCard title="Offload Details">
        <Box display="flex" flexDirection="column" alignItems="center">
          <img src={truckImage} alt="" style={{ width: '337px', height: '188px' }} />
        </Box>

        <Paper elevation={3} style={{ padding: '20px', margin: '20px' }}>
          <Box display="flex" flexDirection="column" alignItems="left">
            <Typography variant="h4" gutterBottom>
              Offload Details
            </Typography>
            <br></br>
            <br></br>
          </Box>
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Offload ID"
                value={OffloadDeatils.id}
                variant="outlined"
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Driver Name"
                value={OffloadDeatils.driverName}
                variant="outlined"
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Date & Time"
                value={OffloadDeatils.dateTime}
                variant="outlined"
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>        
            <Grid item xs={12} md={6}>
              <Button
                variant="contained"
                style={{fontWeight: 'bold'}}
                sx={{
                  backgroundColor: '#116378',
                  color: '#FFFFF',
                  '&:hover': {
                    backgroundColor: '#E5DAD7',
                    color:'#116378',
                  },
                }}
                onClick={'/'} /* Add offload point reciept download route*/
              >
                Download the Reciept
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Paper elevation={3} style={{ padding: '20px', margin: '20px' }}>
          <Box display="flex" flexDirection="column" alignItems="left">
            <Typography variant="h4" gutterBottom>
              Offload Item Details
            </Typography>
          </Box>
          <br></br>
          <br></br>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell>Items</TableCell>
                  <TableCell>Quantities</TableCell>
                  <TableCell>Price per Unit (LKR)</TableCell>
                  <TableCell>Amount (LKR)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {offloaditemslist.map((offloadItem) => (
                  <TableRow key={offloadItem.id}>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell><img src={offloadItem.image} alt={`offloadItem ${offloadItem.id}`} width="50" /></TableCell>
                    <TableCell>{offloadItem.quantity}</TableCell>
                    <TableCell>{offloadItem.price}</TableCell>
                    <TableCell>{offloadItem.amount.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell>Total Amount (LKR)</TableCell>
                  <TableCell>{totalAmount.toFixed(2)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </DashboardCard>
    </PageContainer>
  );
}

export default ViewOffload;
