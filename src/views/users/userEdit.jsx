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
    title: 'User Edit',
  },
];

const EditUser = () => {
  const location = useLocation();
  const { userId, name, email, phone, pfp_link } = location.state;
  const navigate = useNavigate();

  const formatPhoneNumber = (phoneNumber) => {
    // Remove leading '+' or '94'
    phoneNumber = phoneNumber.replace(/^\+?(94)?/, '0');

    // Format with spaces
    return phoneNumber.replace(/(\d{3})(\d{2})(\d{4})/, ' $1 $2 $3');
  };

  //credentials for testing
  const username = 'root';
  const password = 't2c';
  const imagePath = 'https://t2cimg.shieldtechnologies.xyz';

  // Encode credentials to Base64
  const encodedCredentials = btoa(`${username}:${password}`);

  const [userID, setUserId] = useState(userId);
  const [userName, setUserName] = useState(name);
  const [userEmail, setUserEmail] = useState(email);
  const [userPhone, setUserPhone] = useState(phone);
  // const [userAddress, setUserAddress] = useState(address);
  // const [userCity, setUserCity] = useState(city);
  // const [userDob, setUserDob] = useState(dob);

  const handleEdit = async () => {
    try {
      const response = await axios.put(
        `http://ec2-18-143-176-53.ap-southeast-1.compute.amazonaws.com:8080/api/users/${userID}`,
        {
          name: userName,
          email: userEmail,
          mobile: userPhone,
          pfpLink: pfp_link,
        },
        {
          headers: {
            Authorization: `Basic ${encodedCredentials}`,
          },
        },
      );

      console.log(response.data);

      navigate('/users');
    } catch (err) {
      console.error(`Error Edit User : ${userID}`, err);
    }
  };
  return (
    <PageContainer title="User Details" description="this is the User Edit page">
      <Breadcrumb title="User Details" items={BCrumb} />
      <Grid style={{ display: 'flex', gap: 50 }}>
        <DashboardCard title="Change User Details">
          <Typography>Change User Details here</Typography>
          <Grid>
            <center>
              <Avatar
                alt="Remy Sharp"
                src={`${imagePath}/${pfp_link}`}
                sx={{ width: 80, height: 80, marginTop: 5, marginBottom: 3 }}
              />
            </center>

            <Grid>
              <TextField
                style={{ marginTop: 100, width: '40%', margin: 50 }}
                id="outlined-read-only-input"
                label="UID"
                value={userID}
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                style={{ marginTop: 100, width: '40%', margin: 50 }}
                id="outlined-user-name-input"
                label="User Name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
              <TextField
                style={{ marginTop: 20, width: '40%', margin: 50 }}
                id="outlined-email-input"
                label="Email Address"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />
              <TextField
                style={{ marginTop: 20, width: '40%', margin: 50 }}
                id="outlined-phone-input"
                label="Phone Number"
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
              />
              {/* <TextField
                            style={{ marginTop: 20, width: '40%', margin: 50 }}
                            id="outlined-address-input"
                            label="Address"
                            value={userAddress}
                            onChange={(e) => setUserAddress(e.target.value)}
                        />
                        <TextField
                            style={{ marginTop: 20, width: '40%', margin: 50 }}
                            id="outlined-city-input"
                            label="City"
                            value={userCity}
                            onChange={(e) => setUserCity(e.target.value)}
                        />
                        <TextField
                            style={{ marginTop: 20, width: '40%', margin: 50 }}
                            id="outlined-dob-input"
                            label="DoB"
                            value={userDob}
                            onChange={(e) => setUserDob(e.target.value)}
                        /> */}
              <div style={{ marginTop: 0, marginLeft: '910px', display: 'flex', gap: '10px' }}>
                <Button variant="contained" color="info" onClick={handleEdit}>
                  Save
                </Button>
                <Button variant="outlined" color="error" onClick={() => navigate('/users')}>
                  Cancel
                </Button>
              </div>
            </Grid>
          </Grid>
        </DashboardCard>
      </Grid>
    </PageContainer>
  );
};

export default EditUser;
