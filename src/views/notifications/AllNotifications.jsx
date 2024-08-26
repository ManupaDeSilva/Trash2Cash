import { Typography, Avatar, Box, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import React from 'react';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from 'src/components/shared/DashboardCard';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import img1 from 'src/assets/images/profile/user-1.jpg';
import img2 from 'src/assets/images/profile/user-2.jpg';
import img3 from 'src/assets/images/profile/user-3.jpg';
import img4 from 'src/assets/images/profile/user-4.jpg';

const BCrumb = [
    {
        to: '/',
        title: 'Home',
    },
    {
        to: '',
        title: 'Notifications',
    },
];

const notificationList = [
    {
        avatar: img1,
        title: 'Roman Joined the Team!',
        subtitle: 'Congratulate him',
    },
    {
        avatar: img2,
        title: 'New message received',
        subtitle: 'Salma sent you a new message',
    },
    {
        avatar:  img3,
        title: 'New Payment received',
        subtitle: 'Check your earnings',
    },
    {
        avatar:  img4,
        title: 'Jolly completed tasks',
        subtitle: 'Assign her new tasks',
    },
];

const AllNotifications = () => {
    return (
        <PageContainer  sx={{ width: '80%' }} description='In this Page can view all notifications'>
            <Breadcrumb title='All Notifications' items={BCrumb}></Breadcrumb>
            <DashboardCard>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography
                        sx={{
                            fontWeight: 'bold',
                            backgroundColor: 'skyblue',
                            paddingRight: '20px',
                            paddingLeft: '20px',
                            paddingTop: '10px',
                            paddingBottom: '10px',
                            borderRadius: '5px'
                        }}
                    >
                        All
                    </Typography>
                    <Typography
                        sx={{
                            fontWeight: 'bold'
                        }}
                    >
                        Mark all as read
                    </Typography>
                </Box>
                <br/>
                <List>
                    {notificationList.map((notification, index) => (
                        <ListItem key={index} alignItems="flex-start">
                            <ListItemAvatar>
                                <Avatar alt="Notification Avatar" src={notification.avatar} />
                            </ListItemAvatar>
                            <ListItemText
                                primary={notification.title}
                                secondary={notification.subtitle}
                            />
                        </ListItem> 
                    ))}
                </List>
            </DashboardCard>
        </PageContainer>
    );
};

export default AllNotifications;
