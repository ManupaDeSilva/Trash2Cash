import React, { useEffect, useState } from 'react';
import { Box, Avatar, Typography, IconButton, Tooltip, useMediaQuery, Button } from '@mui/material';
import { useSelector } from 'react-redux';
import img1 from 'src/assets/images/profile/user-1.jpg';
import { IconPower } from '@tabler/icons';
import {Link, Navigate, useNavigate} from "react-router-dom";
import Cookies from 'js-cookie';

export const Profile = () => {
  const customizer = useSelector((state) => state.customizer);
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const hideMenu = lgUp ? customizer.isCollapse && !customizer.isSidebarHover : '';
  const [admindata, setAdminData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    CheckAdmin();
  }, [navigate]);

  const CheckAdmin = () => {
    const creds = Cookies.get('admin');
    if (creds) {
      setAdminData(JSON.parse(decodeURI(creds)));
    }
  };

  const handleLogout = () => {
    Cookies.remove('admin');
    Cookies.remove('rememberDevice');
    navigate('/auth/login');
  };

  return (
    <Box
      display={'flex'}
      alignItems="center"
      gap={2}
      sx={{ m: 3, p: 2, bgcolor: `${'secondary.light'}` }}
    >
      {!hideMenu && admindata ? (
        <>
          <Avatar alt="Remy Sharp" src={'https://t2cimg.shieldtechnologies.xyz/images/chakraSutra.png'} />

          <Box>
            <Typography variant="h6"  color="textPrimary">{admindata.fname} {admindata.lname}</Typography>
            <Typography variant="caption" color="textSecondary">Admin</Typography>
          </Box>
          <Box sx={{ ml: 'auto' }}>
            <Tooltip title="Logout" placement="top">
              <IconButton color="primary" component={Button} onClick={handleLogout} aria-label="logout" size="small">
                <IconPower size="20" />
              </IconButton>
            </Tooltip>
          </Box>
        </>
      ) : (
        ''
      )}
    </Box>
  );
};
