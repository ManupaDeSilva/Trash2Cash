import { React, useState, useEffect } from 'react';
import {
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Grid,
  TextareaAutosize,
  Link,
} from '@mui/material';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    to: '/users',
    title: 'Users',
  },
  {
    title: 'User Details',
  },
];

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

//user profile
const UserDetails = () => {
  const location = useLocation();
  const { user } = location.state;
  const { userId } = useParams(); // Extract userId from URL
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.mobile);
  const [pfp_link, setPfp_link] = useState(user.pfpLink);
  const [address, setAddress] = useState('Null');
  const [city, setCity] = useState('Null');
  const [dob, setDob] = useState('Null');

  //credentials for testing
  const username = 'root';
  const password = 't2c';
  const imagePath = 'https://t2cimg.shieldtechnologies.xyz';

  // Encode credentials to Base64
  const encodedCredentials = btoa(`${username}:${password}`);

  //delete function
  const handleDelete = async () => {
    // Add logic here to handle deletion
    try {
      const response = await axios.delete(
        `http://ec2-18-143-176-53.ap-southeast-1.compute.amazonaws.com:8080/api/users/${userId}`,
        {
          headers: {
            Authorization: `Basic ${encodedCredentials}`,
          },
        },
      );

      setOpen(false);

      navigate('/users');
    } catch (err) {
      console.error(`Error Delete User : ${userId}`, err);
    }
  };

  const formatPhoneNumber = (phoneNumber) => {
    // Remove leading '+' or '94'
    phoneNumber = phoneNumber.replace(/^\+?(94)?/, '0');

    // Format with spaces
    return phoneNumber.replace(/(\d{3})(\d{2})(\d{4})/, ' $1 $2 $3');
  };

  const handleEditClick = () => {
    navigate(`/user/edit`, {
      state: {
        userId,
        name,
        email,
        phone,
        pfp_link,
      },
    });
  };

  console.log(user);

  return (
    <PageContainer title="User Details" description="this is the User Details page">
      <Breadcrumb title="User Details" items={BCrumb} />
      <DashboardCard title="User Details">
        <Grid>
          <center>
            <Avatar src={`${imagePath}/${user.pfpLink}`} sx={{ width: 56, height: 56 }} />
          </center>

          <TextField
            style={{ marginTop: 100, width: '40%', margin: 50 }}
            id="outlined-read-only-input"
            label="UID"
            defaultValue={userId}
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            style={{ marginTop: 100, width: '40%', margin: 50 }}
            id="outlined-read-only-input"
            label="User Name"
            defaultValue={user.name}
            InputProps={{
              readOnly: true,
            }}
          />

          <TextField
            style={{ marginTop: 20, width: '40%', margin: 50 }}
            id="outlined-read-only-input"
            label="Email Address"
            defaultValue={user.email}
            InputProps={{
              readOnly: true,
            }}
          />

          <TextField
            style={{ marginTop: 20, width: '40%', margin: 50 }}
            id="outlined-read-only-input"
            label="Phone Number"
            defaultValue={formatPhoneNumber(user.mobile)}
            InputProps={{
              readOnly: true,
            }}
          />

          {/* <TextField
                        style={{ marginTop: 20, width: '40%', margin: 50 }}
                        id="outlined-read-only-input"
                        label="Address"
                        defaultValue={user.address}
                        InputProps={{
                            readOnly: true,
                        }}
                    />

                    <TextField
                        style={{ marginTop: 20, width: '40%', margin: 50 }}
                        id="outlined-read-only-input"
                        label="City"
                        defaultValue={user.address}
                        InputProps={{
                            readOnly: true,
                        }}
                    />

                    <TextField
                        style={{ marginTop: 20, width: '40%', margin: 50 }}
                        id="outlined-read-only-input"
                        label="DoB"
                        // defaultValue={user.dob}
                        InputProps={{
                            readOnly: true,
                        }}
                    /> */}

          <div style={{ marginTop: 0, marginLeft: '910px', display: 'flex', gap: '10px' }}>
            <Button
              variant="contained"
              color="info"
              onClick={() => {
                handleEditClick(userId);
              }}
            >
              Edit
            </Button>
            <Button variant="outlined" color="error" onClick={handleOpen}>
              Delete
            </Button>
          </div>

          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Fade in={open}>
              <Box sx={style}>
                <center>
                  <ReportProblemIcon
                    color="error"
                    sx={{ fontSize: 60, marginBottom: 2, color: 'red' }}
                  />
                  <Typography id="transition-modal-title" variant="h6" component="h1" gutterBottom>
                    Are you sure?
                  </Typography>

                  <Typography id="transition-modal-description" sx={{ mb: 2 }}>
                    This action will delete user from the system. You won’t be able to revert this!
                  </Typography>

                  <Button
                    variant="contained"
                    color="error"
                    sx={{ backgroundColor: 'red' }}
                    onClick={handleDelete}
                  >
                    Yes, delete it.
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleClose}
                    sx={{ marginLeft: 2 }}
                  >
                    Cancel
                  </Button>
                </center>
              </Box>
            </Fade>
          </Modal>
        </Grid>
      </DashboardCard>
    </PageContainer>
  );
};

//add user

export default UserDetails;
