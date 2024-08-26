import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Grid,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fade,
  Modal,
  Backdrop,
} from '@mui/material';
import Breadcrumb from '../../layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import { useNavigate } from 'react-router-dom';
import MapComponent from './Components/sectorSelector';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import axios from 'axios';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    to: '/timeSlots',
    title: 'Time Slots',
  },
  {
    title: 'Add Sector',
  },
];

//credentials for testing
const username = 'root';
const imagePath = 'https://t2cimg.shieldtechnologies.xyz';
const password = 't2c';

// Encode credentials to Base64
const encodedCredentials = btoa(`${username}:${password}`);

const TimeSlots = () => {
  const [sectorName, setSectorName] = useState('');
  const [sector, setSector] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [dataModal, setDataModal] = useState(null);
  const [formError, setFormError] = useState([false, '']);

  const handleAddSector = async () => {
    if (!sectorName) {
      setFormError([true, 'Sector name is required']);
      return;
    }

    if (sectorName.length > 40) {
      setFormError([true, 'Sector name is too long (minimum 40 characters)']);
      return;
    }

    if (!sector) {
      setFormError([false, 'A shape must be drawn on the map']);
      return;
    }

    setFormError('');

    try {
      const response = await axios.post(
        'http://ec2-18-143-176-53.ap-southeast-1.compute.amazonaws.com:8080/api/sectors',
        {
          name: sectorName,
          sector: JSON.stringify(sector),
        },
        {
          headers: {
            Authorization: `Basic ${encodedCredentials}`,
          },
        },
      );
      setDataModal(response.data);
      if (response.data.isSuccessfull) {
        setOpenModal(true);
        setSectorName('');
        MapComponent.handleRemoveShape();
      } else {
        setOpenModal(true);
      }
      setOpenModal(true);
      console.log('Saved sector: ', response.data);
    } catch (error) {
      console.error('Error saving sector: ', error);
    }
  };

  return (
    <PageContainer title="Time Slots" description="This is the Time Slots">
      <Breadcrumb title="Time Slots" items={BCrumb} />
      <DashboardCard title="Add New Sector">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Sector Name"
              variant="outlined"
              fullWidth
              value={sectorName}
              onChange={(e) => setSectorName(e.target.value)}
              error={!!formError[0]}
              helperText={formError[0] && formError[1]}
              style={{ marginBottom: '10px' }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddSector}
              style={{ marginBottom: '10px' }}
            >
              Add Sector
            </Button>
          </Grid>
          <Grid item xs={12}>
            {!!!formError[0] && (
              <Typography color="error" variant="body2" style={{ marginTop: '10px' }}>
                {formError[1]}
              </Typography>
            )}
            <MapComponent setSector={setSector} />
          </Grid>
        </Grid>
      </DashboardCard>
      {/* <Dialog open={MapComponent.isDialogOpen} onClose={() => MapComponent.handleDialogClose(false)}>
        <DialogTitle>{"Confirm Shape Removal"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            A shape already exists. Do you want to remove the previous shape and proceed?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => MapComponent.handleDialogClose(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => MapComponent.handleDialogClose(true)} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog> */}

      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openModal}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              transform: 'translate(-50%, -50%)',
              width: 450,
              bgcolor: 'background.paper',
              border: '2px solid #000',
              boxShadow: 24,
              p: 4,
            }}
          >
            <CheckCircleOutlineIcon />
            <Typography variant="h6" sx={{ mt: 1 }} component="h2">
              Success
            </Typography>
            <Typography sx={{ mt: 1 }}>Sector Was Added Successfully</Typography>
          </Box>
        </Fade>
      </Modal>
    </PageContainer>
  );
};

export default TimeSlots;
