import React, { useState } from 'react';
import {
  Typography,
  Grid,
  Button,
  Modal,
  Fade,
  Backdrop,
  Box,
  Link,
  TextField,
  InputAdornment,
} from '@mui/material';
import DashboardCard from '../../components/shared/DashboardCard';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneIcon from '@mui/icons-material/Phone';
import ChatIcon from '@mui/icons-material/Chat';
import { MuiOtpInput } from 'mui-one-time-password-input';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import OTPicon from '../../assets/images/svgs/otp_icon.svg';
import axios from 'axios';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import HomeIcon from '@mui/icons-material/Home';
import { useLocation, useNavigate } from 'react-router-dom';

const AddDriver = () => {
  const [openOk, setOpenOk] = useState(false); // OTP sent modal
  const [openOTP, setOpenOTP] = useState(false); // OTP input modal
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60); // Timer state
  const [openReg, setOpenReg] = useState(false); // Registration completed modal
  const navigate = useNavigate();

  // Testing credentials
  const username = 'root';
  const password = 't2c';
  // Encode credentials to Base64
  const encodedCredentials = btoa(`${username}:${password}`);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
  });

  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
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

  // Validate form fields
  const validateForm = () => {
    let errors = {
      name: '',
      email: '',
      phoneNumber: '',
      address: '',
    };

    if (form.name.trim() === '') {
      errors.name = 'Name is required';
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = 'Email is not valid';
    }

    if (!/^\d{10}$/.test(form.phoneNumber)) {
      errors.phoneNumber = 'Phone number should be 10 digits';
    }

    if (form.address.trim() === '') {
      errors.address = 'Address is required';
    }

    setFormErrors(errors);

    // Check if there are no errors
    return Object.values(errors).every((error) => error === '');
  };

  // Handle functions for OTP sent modal
  const handleOpenOk = () => setOpenOk(true);
  const handleCloseOk = () => {
    setOpenOk(false);
    setTimeout(() => setOpenOTP(true), 500); // Delay to ensure modal transitions smoothly
  };

  // Handle functions for input OTP modal
  const handleCloseOTP = () => {
    if (validateForm()) {
      setOpenOTP(false);
      setOpenOk(false);
      setOtp('');
      setOpenReg(true); // Open registration completed modal
    } else {
      alert('Please fill all fields correctly');
    }
  };

  // Function for sending OTP
  const sendOTP = () => {
    // Simulated logic to send OTP
    handleOpenOk();
  };

  // Validate OTP input
  const matchIsNumeric = (text) => {
    const isNumber = typeof text === 'number';
    const isString = typeof text === 'string';
    return (isNumber || (isString && text !== '')) && !isNaN(Number(text));
  };

  const validateChar = (value, index) => {
    return matchIsNumeric(value);
  };

  // Check if the OTP is completely filled
  const isOtpComplete = otp.length === 4 && otp.split('').every((char) => matchIsNumeric(char));

  // Define style objects for modals
  const modalStyle = {
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
  // Function to validate and format mobile number
  const validateAndFormatMobile = (number) => {
    if (number.startsWith('0')) {
      number = '94' + number.substring(1);
    }
    if (number.startsWith('94') && number.charAt(2) === '0') {
      number = '94' + number.substring(3);
    }
    return number;
  };

  // Handle adding a new driver
  const handleAddDriver = async () => {
    let formattedMobile = validateAndFormatMobile(form.phoneNumber);
    try {
      if (validateForm()) {
        const response = await axios.post(
          `http://ec2-18-143-176-53.ap-southeast-1.compute.amazonaws.com:8080/api/drivers`,
          {
            name: form.name,
            email: form.email,
            mobile: formattedMobile,
            addressline_1: form.address,
            addressline_2: form.address,
            pfp_link: 'images/chakraSutra.png',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            last_online: new Date().toISOString(),
            driverStatus: {
              id: 2,
              status: 'online',
            },
            notifToken: 'test',
          },
          {
            headers: {
              Authorization: `Basic ${encodedCredentials}`,
            },
          },
        );
        if (response.status === 200) {
          console.log(response.data);
          setOpenReg(true);

          navigate('/driver');
        }
      }
    } catch (err) {
      console.log('Error Adding Driver:', err);
    }
  };

  return (
    <>
      <PageContainer title="Add Driver Page" description="This is the add driver page">
        <Breadcrumb
          title="Add New Driver"
          items={[
            { to: '/', title: 'Home' },
            { to: '/driver', title: 'Driver' },
            { title: 'Add Driver' },
          ]}
        />

        <DashboardCard title="Add New Driver">
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={4}>
              <Typography variant="subtitle1">Name</Typography>
            </Grid>
            <Grid item xs={8}>
              <TextField
                fullWidth
                name="name"
                value={form.name}
                onChange={handleChange}
                margin="normal"
                placeholder="John Doe"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineIcon />
                    </InputAdornment>
                  ),
                }}
                error={!!formErrors.name}
                helperText={formErrors.name}
              />
            </Grid>
            <Grid item xs={4}>
              <Typography variant="subtitle1">Email</Typography>
            </Grid>
            <Grid item xs={8}>
              <TextField
                fullWidth
                name="email"
                value={form.email}
                onChange={handleChange}
                margin="normal"
                placeholder="john.doe@example.com"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailOutlineIcon />
                    </InputAdornment>
                  ),
                }}
                error={!!formErrors.email}
                helperText={formErrors.email}
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
                placeholder="1234567890"
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
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
            <Button variant="contained" color="primary" onClick={handleAddDriver}>
              Submit
            </Button>
          </Box>
        </DashboardCard>
      </PageContainer>

      {/* Sent OTP modal */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openOk}
        onClose={handleCloseOk}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openOk}>
          <Box sx={modalStyle}>
            <center>
              <Typography variant="h6">OTP sent to the number</Typography>
              <Button variant="outlined" onClick={handleCloseOk} sx={{ top: 10 }}>
                OK
              </Button>
            </center>
          </Box>
        </Fade>
      </Modal>

      {/* Insert OTP modal */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openOTP}
        onClose={handleCloseOTP}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openOTP}>
          <Box sx={modalStyle}>
            <center>
              <img
                src={OTPicon}
                alt="OTP Icon"
                style={{ width: '50px', height: '50px', marginBottom: '20px' }}
              />
              <Typography variant="h6" marginBottom="30px">
                Verify your number with the code sent to you
              </Typography>
              <MuiOtpInput
                autoFocus
                value={otp}
                onChange={(newValue) => setOtp(newValue)}
                validateChar={validateChar}
                marginBottom="30px"
              />
              <Typography variant="h6" marginBottom="30px">
                <Link
                  href="#"
                  onClick={sendOTP}
                  style={{ color: '#ff7a00', textDecoration: 'none' }}
                >
                  I didn’t receive the code
                </Link>
                , Resend in {timer} sec
              </Typography>
              <Button
                variant="outlined"
                onClick={handleCloseOTP}
                sx={{ top: 10 }}
                disabled={!isOtpComplete}
              >
                CONTINUE
              </Button>
            </center>
          </Box>
        </Fade>
      </Modal>

      {/* Registration completed modal */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openReg}
        onClose={() => setOpenReg(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openReg}>
          <Box sx={modalStyle}>
            <center>
              <CheckCircleOutlineIcon sx={{ fontSize: 60, marginBottom: 2, color: 'green' }} />
              <Typography variant="h6">Driver Added Successfully!</Typography>
              <Button variant="outlined" onClick={() => setOpenReg(false)} sx={{ top: 10 }}>
                OK
              </Button>
            </center>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default AddDriver;
