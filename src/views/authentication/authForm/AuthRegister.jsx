import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Modal,
  Backdrop,
  Fade,
  Alert,
} from '@mui/material';
import OTPInput from 'react-otp-input';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import PageContainer from 'src/components/container/PageContainer';
import OTPicon from 'src/assets/images/svgs/otp_icon.svg'; // Make sure to replace with your actual OTP icon path
import axios from 'axios';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 450,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

// Testing credentials
const username = 'root';
const password = 't2c';
// Encode credentials to Base64
const encodedCredentials = btoa(`${username}:${password}`);

const AuthRegister = ({ title, subtext, subtitle }) => {
  const [searchParams] = useSearchParams();
  const [openOk, setOpenOk] = useState(false);
  const [openOTP, setOpenOTP] = useState(true);
  const [openReg, setOpenReg] = useState(false);

  const [otp, setOtp] = useState('');
  const [authorized, setAuthorized] = useState(false);
  const [authMessage, setAuthMessage] = useState('');

  const [alertOTPOpen, setAlertOTPOpen] = useState(false);
  const [isOTPSuccess, setIsOTPSuccess] = useState(false);
  const [otpMessage, setOTPMessage] = useState('');

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');

  const [timer, setTimer] = useState(30);
  const [isOtpComplete, setIsOtpComplete] = useState(false); // Flag to check if OTP input is complete

  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConf, setPasswordConf] = useState('');
  const [tc, setTc] = useState(false);
  const token = searchParams.get('token');

  const CheckCode = async () => {
    try {
      const response = await axios.get(`http://ec2-18-143-176-53.ap-southeast-1.compute.amazonaws.com:8080/api/auth/register?token=${token}`, {
        headers: {
          Authorization: `Basic ${encodedCredentials}`,
        },
      });
      console.log('Response:', response.data);
      if (response.data.successful) {
        setAuthorized(true);
      } else {
        setAuthorized(false);
        setAuthMessage(response.data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      // handle error
    }
  };

  useEffect(() => {
    CheckCode();
  }, []);

  useEffect(() => {
    let interval;
    if (openOTP && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [openOTP, timer]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await sendOtpToUser(); // Replace with actual API call
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
  };

  const CheckUsername = async (usernameCheck) => {
    try {
      const response = await axios.post(`http://ec2-18-143-176-53.ap-southeast-1.compute.amazonaws.com:8080/api/admins/check/username`, null, {
        params: {
          username: usernameCheck,
        },
        headers: {
          Authorization: `Basic ${encodedCredentials}`,
        },
      });
      // console.log('Response:', response);
      if (!response.data.successful) {
        setAlertMsg(response.data.message);
        setAlertOpen(true);
      }
    } catch (err) {
      // console.error('Error checking username:', err);
    }
  };

  const CheckEmail = async (emailCheck) => {
    try {
      const response = await axios.post(`http://ec2-18-143-176-53.ap-southeast-1.compute.amazonaws.com:8080/api/admins/check/email`, null, {
        params: {
          email: emailCheck,
        },
        headers: {
          Authorization: `Basic ${encodedCredentials}`,
        },
      });
      // console.log('Response:', response);
      if (!response.data.successful) {
        setAlertMsg(response.data.message);
        setAlertOpen(true);
      }
    } catch (err) {
      // console.error('Error checking username:', err);
    }
  };

  const CheckMobile = async (mobileCheck) => {
    try {
      const response = await axios.post(`http://ec2-18-143-176-53.ap-southeast-1.compute.amazonaws.com:8080/api/admins/check/mobile`, null, {
        params: {
          mobile: mobileCheck,
        },
        headers: {
          Authorization: `Basic ${encodedCredentials}`,
        },
      });
      // console.log('Response:', response);
      if (!response.data.successful) {
        setAlertMsg(response.data.message);
        setAlertOpen(true);
      }
    } catch (err) {
      // console.error('Error checking username:', err);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      await verifyOtp(otp);
    } catch (error) {
      console.error('Error verifying OTP:', error);
    }
  };

  const handleCloseOk = () => {
    setOpenOk(false);
    setOpenOTP(true); // Open OTP entry dialog after the initial message
    setTimer(30); // Reset timer when OTP modal opens
  };

  const handleCloseOTP = () => {
    setOpenOTP(false);
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const handleOTPChange = (otp) => {
    setOtp(otp);
    setIsOtpComplete(otp.length === 6); // Check if OTP input is complete
  };

  const handleOTPResend = async () => {
    try {
      const response = await axios.get(`http://ec2-18-143-176-53.ap-southeast-1.compute.amazonaws.com:8080/api/auth/otp`, {
        params: {
          email: email,
        },
        headers: {
          Authorization: `Basic ${encodedCredentials}`,
        },
      });
      console.log('Response:', response.data);
      if (response.data.successful) {
        setOpenOTP(true); // Open OTP entry dialog after the initial message
        setTimer(30);
      }
    } catch (error) {
      console.error('Error:', error);
      // handle error
    }
  };

  const sendOtpToUser = async () => {
    if (
      fname === '' ||
      lname === '' ||
      email === '' ||
      mobile === '' ||
      username === '' ||
      password === '' ||
      passwordConf === ''
    ) {
      setAlertMsg('Please Fill All Fields');
      setAlertOpen(true);
    } else if (!tc) {
      setAlertMsg('Please Agree To The Terms And Conditions');
      setAlertOpen(true);
    } else if (password !== passwordConf) {
      setAlertMsg('Passwords Do Not Match');
      setAlertOpen(true);
    } else {
      try {
        const response = await axios.post(
          `http://ec2-18-143-176-53.ap-southeast-1.compute.amazonaws.com:8080/api/auth/otp`,
          {
            email: email,
            username: username,
            mobile: mobile,
          },
          {
            headers: {
              Authorization: `Basic ${encodedCredentials}`,
              'Content-Type': 'application/json',
            },
          },
        );
        console.log('Response:', response.data);
        if (response.data.successful) {
          setOpenOk(true);
        } else {
          setAlertMsg(response.data.message);
          setAlertOpen(true);
        }
      } catch (error) {
        console.error('Error:', error);
        // handle error
      }
    }
    console.log(`Sending OTP to ${email}`);
    // Simulated delay
  };

  const verifyOtp = async (otp) => {
    if (!isOtpComplete) {
      setIsOTPSuccess(false);
      setOTPMessage('Please Fill OTP Field');
      setAlertOTPOpen(true);
    } else {
      try {
        const response = await axios.post(
          `http://ec2-18-143-176-53.ap-southeast-1.compute.amazonaws.com:8080/api/auth/register`,
          {
            fname: email,
            lname: email,
            email: email,
            username: username,
            mobile: mobile,
            password: password,
          },
          {
            params: {
              otp: otp,
              token: token,
            },
            headers: {
              Authorization: `Basic ${encodedCredentials}`,
              'Content-Type': 'application/json',
            },
          },
        );
        console.log('Response:', response.data);
        if (response.data.successful) {
          setOpenReg(true);
          setOpenOTP(false);
        } else {
          setIsOTPSuccess(response.data.successful);
          setOTPMessage(response.data.message);
          setAlertOTPOpen(true);
        }
      } catch (error) {
        console.error('Error:', error);
        // handle error
      }
    }
    console.log(`Sending OTP to ${email}`);
    // Simulated delay
  };

  return (
    <>
      {!authorized && <Alert severity="error">{authMessage}</Alert>}
      {authorized && (
        <PageContainer>
          <Box>
            <Typography variant="h4" gutterBottom>
              {title}
            </Typography>
            {subtext}
            {alertOpen && (
              <Alert severity="error" onClose={handleAlertClose}>
                {alertMsg}
              </Alert>
            )}
            <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleSignUp}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    value={fname}
                    onChange={(e) => setFname(e.target.value)}
                    id="firstName"
                    label="First Name"
                    name="firstName"
                    autoComplete="fname"
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    value={lname}
                    onChange={(e) => setLname(e.target.value)}
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="lname"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    value={email}
                    onInput={(e) => CheckEmail(e.target.value)}
                    onChange={(e) => setEmail(e.target.value)}
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="contactNumber"
                    value={mobile}
                    onInput={(e) => CheckMobile(e.target.value)}
                    onChange={(e) => setMobile(e.target.value)}
                    label="Contact Number"
                    name="contactNumber"
                    autoComplete="tel"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    value={username}
                    onInput={(e) => CheckUsername(e.target.value)}
                    onChange={(e) => setUsername(e.target.value)}
                    label="Username"
                    name="username"
                    autoComplete="username"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    label="Password"
                    name="password"
                    autoComplete="new-password"
                    type="password"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="confirmPassword"
                    value={passwordConf}
                    onChange={(e) => setPasswordConf(e.target.value)}
                    label="Confirm Password"
                    name="confirmPassword"
                    autoComplete="new-password"
                    type="password"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={tc}
                        onChange={(e) => setTc(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="I agree to the terms and conditions."
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link to="/login" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>

            {/* OTP Sent OK */}
            <Modal
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
                  <Typography variant="h6" component="h2">
                    <CheckCircleOutlineIcon /> OTP Sent Successfully!
                  </Typography>
                  <Typography sx={{ mt: 2 }}>Please check your email for the OTP.</Typography>
                  <Button onClick={handleCloseOk} color="primary">
                    OK
                  </Button>
                </Box>
              </Fade>
            </Modal>

            {/* OTP Entry */}
            <Modal
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
                  <Typography variant="h6" component="h2">
                    Enter OTP
                  </Typography>
                  {alertOTPOpen && (
                    <Alert
                      severity={isOTPSuccess ? 'success' : 'error'}
                      onClose={() => setAlertOTPOpen(false)}
                    >
                      {otpMessage}
                    </Alert>
                  )}
                  <OTPInput
                    value={otp}
                    onChange={handleOTPChange}
                    numInputs={6}
                    separator={<span>-</span>}
                    inputStyle={{
                      width: '3rem',
                      height: '3.4rem',
                      margin: '0 0.4rem',
                      fontSize: '2rem',
                      borderRadius: 4,
                      border: '1px solid rgba(0,0,0,0.3)',
                    }}
                    isInputNum
                    renderInput={(props) => <input {...props} />} // Add this line to provide renderInput prop
                    shouldAutoFocus
                  />
                  <Button
                    onClick={handleOtpSubmit}
                    color="primary"
                    disabled={!isOtpComplete} // Disable button if OTP is not complete
                  >
                    Verify
                  </Button>
                  {timer > 0 ? (
                    <Typography variant="body2">Resend OTP in {timer} seconds</Typography>
                  ) : (
                    <Link to="#" onClick={handleOTPResend} disabled={timer > 0}>
                      Resend OTP
                    </Link>
                  )}
                </Box>
              </Fade>
            </Modal>

            {/* Registration Success */}
            <Modal
              open={openReg}
              onClose={() => setOpenReg(false)}
              closeAfterTransition
              BackdropComponent={Backdrop}
              BackdropProps={{
                timeout: 500,
              }}
            >
              <Fade in={openReg}>
                <Box sx={style}>
                  <Typography variant="h6" component="h2">
                    <CheckCircleOutlineIcon /> Registration Successful!
                  </Typography>
                  <Typography sx={{ mt: 2 }}>
                    Your account has been created successfully.
                  </Typography>
                  <Link to="/auth/login">
                    <Button color="primary">Go to Login</Button>
                  </Link>
                </Box>
              </Fade>
            </Modal>
          </Box>
        </PageContainer>
      )}
    </>
  );
};

export default AuthRegister;
