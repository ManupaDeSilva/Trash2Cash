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
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneIcon from '@mui/icons-material/Phone';
import ChatIcon from '@mui/icons-material/Chat';
import OTPicon from '../../assets/images/svgs/otp_icon.svg';
import { MuiOtpInput } from 'mui-one-time-password-input';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
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
    title: 'User Add',
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

const AddUser = () => {
  const [openOk, setOpenOk] = useState(false); // OTP sent modal
  const [openOTP, setOpenOTP] = useState(false); // OTP input modal
  const [openReg, setOpenReg] = useState(false); // registration completed modal
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60); // Timer state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Testing credentials
  const username = 'root';
  const password = 't2c';
  // Encode credentials to Base64
  const encodedCredentials = btoa(`${username}:${password}`);

  // useEffect for seconds countdown
  useEffect(() => {
    let interval;
    if (openOTP && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [openOTP, timer]);

  const handleOpenOk = () => setOpenOk(true);
  const handleCloseOk = () => {
    setOpenOk(false);
    setTimeout(() => handleOpenOTP(), 500); // Delay to ensure modal transitions smoothly
  };

  const handleOpenOTP = () => {
    setTimer(60); // Reset timer when opening the OTP modal
    setOpenOTP(true);
  };

  const handleCloseOTP = () => {
    // logic for registering the user to the system
    setOtp(''); // Reset OTP input fields
    setOpenOTP(false);
  };

  const handleOTPChange = (newValue) => {
    setOtp(newValue);
  };

  const matchIsString = (text) => {
    return typeof text === 'string' || text instanceof String;
  };

  function matchIsNumeric(text) {
    const isNumber = typeof text === 'number';
    const isString = matchIsString(text);
    return (isNumber || (isString && text !== '')) && !isNaN(Number(text));
  }

  const validateChar = (value, index) => {
    return matchIsNumeric(value);
  };

  const isOtpComplete = otp.length === 4 && otp.split('').every((char) => matchIsNumeric(char));
  const isFormComplete = name && email && mobile && message;

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

  //check mobile number already existing in the db
  const checkNumber = async () => {
    let formattedMobile = validateAndFormatMobile(mobile);
    try {
      const response = await axios.get(
        `http://ec2-18-143-176-53.ap-southeast-1.compute.amazonaws.com:8080/ttc/otp/check/${formattedMobile}`,
        {
          headers: {
            Authorization: `Basic ${encodedCredentials}`,
          },
        },
      );
      console.log(response.data);

      if (response.data === false) {
        sendOTP();
      } else {
        console.log('User already exist');
      }
    } catch (err) {
      console.error('Error Cheking number:', err);
    }
  };

  // Function for sending OTP
  const sendOTP = async () => {
    let formattedMobile = validateAndFormatMobile(mobile);
    console.log(formattedMobile);
    try {
      const response = await axios.post(
        `http://ec2-18-143-176-53.ap-southeast-1.compute.amazonaws.com:8080/ttc/otp/send/${formattedMobile}`,
        null,
        {
          headers: {
            Authorization: `Basic ${encodedCredentials}`,
          },
        },
      );
      console.log(response.data);

      if (response.status === 200) {
        console.log(response.data);
        handleOpenOk(); // Show OTP sent modal
      }
    } catch (error) {
      console.log('Error sending OTP:', error);
    }
  };

  const verifyOTP = async () => {
    let formattedMobile = validateAndFormatMobile(mobile);
    console.log(otp);
    try {
      const response = await axios.post(
        `http://ec2-18-143-176-53.ap-southeast-1.compute.amazonaws.com:8080/ttc/otp/signup/verify/${formattedMobile}/${otp}`,
        {
          name: name,
          email: email,
          mobile: formattedMobile,
          pfp_link: 'images/94729059707.png',
          available_points: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          headers: {
            Authorization: `Basic ${encodedCredentials}`,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log(response.data);
      if (response.status === 200) {
        setOpenReg(true); // Show OTP sent modal
        setOpenOTP(false);
        navigate('/users');
      }
    } catch (err) {
      console.log('Error verifying OTP:', err);
    }
  };

  return (
    <PageContainer title="Add User" description="this is the Add User">
      <Breadcrumb title="Add User" items={BCrumb} />
      <DashboardCard>
        <Grid>
          <DashboardCard title="Add New User">
            <Grid display="flex" style={{ marginTop: 20 }}>
              <Typography variant="h6">Name</Typography>
              <TextField
                style={{ width: '100%', marginLeft: 204 }}
                id="name-input"
                value={name}
                placeholder="Jonathan Jacobo"
                onChange={(e) => setName(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid display="flex" style={{ marginTop: 20 }}>
              <Typography variant="h6">Email</Typography>
              <TextField
                style={{ width: '100%', marginLeft: 208 }}
                id="email-input"
                placeholder="jacobo@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailOutlineIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid display="flex" style={{ marginTop: 20 }}>
              <Typography variant="h6">Phone</Typography>
              <TextField
                style={{ width: '100%', marginLeft: 200 }}
                id="phone-input"
                value={mobile}
                placeholder="9470"
                onChange={(e) => setMobile(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid display="flex" style={{ marginTop: 20 }}>
              <Typography variant="h6">Message</Typography>
              <TextField
                style={{ width: '100%', marginLeft: 180 }}
                id="message-input"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ChatIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Button
              variant="contained"
              color="info"
              style={{ position: 'relative', left: '250px', bottom: '-15px' }}
              onClick={checkNumber}
              disabled={!isFormComplete}
            >
              Submit
            </Button>
          </DashboardCard>
        </Grid>

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
            <Box sx={style}>
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
            <Box sx={style}>
              <center>
                <img
                  src={OTPicon}
                  alt="OTP Icon"
                  style={{ width: '50px', height: '50px', marginBottom: '20px' }}
                />{' '}
                {/* Display the SVG icon */}
                <Typography variant="h6" marginBottom="30px">
                  Verify your number with the code sent to you
                </Typography>
                <MuiOtpInput
                  autoFocus
                  value={otp}
                  onChange={handleOTPChange}
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
                  onClick={verifyOTP}
                  sx={{ top: 10 }}
                  disabled={!isOtpComplete}
                >
                  CONTINUE
                </Button>
              </center>
            </Box>
          </Fade>
        </Modal>

        {/* registration completed modal */}
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={openReg}
          onClose={handleCloseOk}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={openReg}>
            <Box sx={style}>
              <center>
                <CheckCircleOutlineIcon sx={{ fontSize: 60, marginBottom: 2, color: 'green' }} />
                <Typography variant="h6">User Added Successfully!</Typography>
                <Button variant="outlined" sx={{ top: 10 }} onClick={() => setOpenReg(false)}>
                  OK
                </Button>
              </center>
            </Box>
          </Fade>
        </Modal>
      </DashboardCard>
    </PageContainer>
  );
};

export default AddUser;
