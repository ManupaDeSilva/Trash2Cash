// Router.jsx

import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from '../layouts/full/shared/loadable/Loadable';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TimeSlots from 'src/views/timeSlots/timeSlots';
import AddTime from 'src/views/timeSlots/addTime';
import EditTime from 'src/views/timeSlots/editTime';
import DriverDetails from 'src/views/driver/DriverDetails';
import AssignRiderByDate from 'src/views/pickup/assignRiderByADate';
import AssignRiderByPickup from 'src/views/pickup/assignRiderByPickup';
import AssignRiderByTimeSlots from 'src/views/pickup/assignRiderATimeSlot';

/* **Layouts* */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

/* *Pages** */
const Home = Loadable(lazy(() => import('../views/home/home')));
const Error = Loadable(lazy(() => import('../views/authentication/Error')));
const OffloadPoints = Loadable(lazy(() => import('../views/offloadPoints/offloadpoints')));
const AddPoint = Loadable(lazy(() => import('../views/offloadPoints/AddOffloadPoint')));
const ViewOffload = Loadable(lazy(() => import('../views/offloadPoints/ViewOffload')));
const Viewoffloadpoints = Loadable(lazy(() => import('../views/offloadPoints/ViewoffloadPoints')));
const AssignOffloadPoint = Loadable(lazy(() => import('../views/offloadPoints/AssignOffloadPoint')));
const Users = Loadable(lazy(() => import('../views/users/users')));
const UserDetails = Loadable(lazy(() => import('../views/users/userProfile')));
const UserAdd = Loadable(lazy(() => import('../views/users/userAdd')));
const UserEdit = Loadable(lazy(() => import('../views/users/userEdit')));
const Pickups = Loadable(lazy(() => import('../views/pickup/pickups')));
const AddPickup = Loadable(lazy(() => import('../views/pickup/AddPickup')));
const EditPickup = Loadable(lazy(() => import('../views/pickup/EditPickup')));
const CompletePickup = Loadable(lazy(() => import('../views/pickup/completePickup')));
const DeletePickup = Loadable(lazy(() => import('../views/pickup/deletePickup')));
const ViewPickup = Loadable(lazy(() => import('../views/pickup/viewPickup'))); // Updated
const AssignRider = Loadable(lazy(() => import('../views/pickup/assignRiderATimeSlot')));
const Invites = Loadable(lazy(() => import('../views/invites/invites')));
const Driver = Loadable(lazy(() => import('../views/driver/driver')));
const DriverProfile = Loadable(lazy(() => import('../views/driver/DriverProfile')));
const EditDriver = Loadable(lazy(() => import('../views/driver/editdriver'))); // Importing EditDriver
const AssignPickup = Loadable(lazy(() => import('../views/driver/AssignPickup')));
const AddDriver = Loadable(lazy(() => import('../views/driver/AddDriver')));
const Login = Loadable(lazy(() => import('../views/authentication/auth/Login')));
const Register = Loadable(lazy(() => import('../views/authentication/auth/Register')));
const ViewProfile = Loadable(lazy(() => import('../layouts/full/vertical/header/ViewProfile')));
const EditAdmin = Loadable(lazy(() => import('../layouts/full/vertical/header/EditAdmin')));
const DropoffPoints = Loadable(lazy(() => import('../views/dropoffPoints/dropoffpoints')));
const Viewdropoffpoints = Loadable(lazy(() => import('../views/dropoffPoints/ViewDropoffPoint')));
const AddDropoffPoint = Loadable(lazy(() => import('../views/dropoffPoints/AddDropoffPoint')));
const TimeSlotsEmpty = Loadable(lazy(() => import('../views/timeSlots/timeSlotEmpty')));
const TempTimeSlot = Loadable(lazy(() => import('../views/timeSlots/tempTimeSlots')));
const AddTimeslotSector = Loadable(lazy(() => import('../views/timeSlots/addSector')));
const Settings = Loadable(lazy(()=> import ('../views/settings/settings')));
const ViewDropoff = Loadable(lazy(()=> import ('../views/dropoffPoints/ViewDropoff')));
const AddDropoff = Loadable(lazy(()=> import ('../views/dropoffPoints/AddDropoff')));
const DriverPickupHistory = Loadable(lazy(()=> import ('../views/driver/DriverPickupHistory')));
const Allnotificatons =  Loadable(lazy(()=> import ('../views/notifications/AllNotifications')));
const Router = [
  {
    path: '/',
    element: <FullLayout />,
    children: [
      { path: '/', element: <Navigate to="/home" /> },
      { path: '/home', exact: true, element: <Home /> },
      { path: '/users', exact: true, element: <Users /> },
      { path: '/offloadpoints', exact: true, element: <OffloadPoints />}, // Offloadpoints main page route
      { path: '/add-offloadpoint', exact: true, element: <AddPoint />}, // add new offload point route
      { path: '/view-offload', exact: true, element: <ViewOffload/>},
      { path: '/view-offloadpoint/:offloadId', exact: true, element: <Viewoffloadpoints /> },
      { path: '/assign-offloadpoint/:offloadId', exact: true, element: <AssignOffloadPoint /> },
      { path: '/user/details/:userId', exact: true, element: <UserDetails /> },
      { path: '/user/add', exact: true, element: <UserAdd /> },
      { path: '/user/edit', exact: true, element: <UserEdit /> },
      
      { path: '/pickups', exact: true, element: <Pickups /> },
      { path: '/add-pickup', exact: true, element: <AddPickup /> },
      { path: '/edit-pickup/:pickupID', exact: true, element: <EditPickup /> },  
      { path: '/complete-pickup/:pickupID', exact: true, element: <CompletePickup /> },  
      { path: '/delete-pickup/:pickupID', exact: true, element: <DeletePickup /> },
      { path: '/view-pickup/:pickupID', exact: true, element: <ViewPickup /> },
      { path: '/assign-a-riderByTimeslots', exact: true, element: <AssignRiderByTimeSlots /> },
      { path: '/assign-a-riderByDate', exact: true, element: <AssignRiderByDate /> },
      { path: '/assign-a-riderByPickup', exact: true, element: <AssignRiderByPickup /> }, 
      { path: '/invites', exact: true, element: <Invites /> },
      // driver
      { path: '/driver', exact: true, element: <Driver /> },
      { path: '/driver/profile', exact: true, element: <DriverProfile /> },
      { path: '/driver/edit', exact: true, element: <EditDriver /> }, // Adding EditDriver route
      { path: '/driver/assign-pickup', exact: true, element: <AssignPickup /> },
      { path: '/driver/add', exact: true, element: <AddDriver /> },
      { path: '/driver/details', exact: true, element: <DriverDetails /> },
      { path: '/admin/view-profile', exact: true, element: <ViewProfile /> },
      { path: '/edit-admin', exact: true, element: <EditAdmin /> },
      { path: '/driver-history', exact: true, element: <DriverPickupHistory /> },

      //timeSlots
      { path: '/temptimeslot', exact: true, element: <TempTimeSlot /> },
      { path: '/timeSlots', exact: true, element: <TimeSlots /> },
      { path: '/timeSlots-empty', exact: true, element: <TimeSlotsEmpty /> },
      { path: '/addSector', exact: true, element: <AddTimeslotSector /> },
      { path: '/addTime', exact: true, element: <AddTime /> },
      { path: '/editTime', exact: true, element: <EditTime /> },

      //settings
      { path: '/settings', exact: true, element: <Settings /> },

      //Dropoff
      { path: '/dropoffPoints', exact: true, element: <DropoffPoints/> },
      { path: '/add-dropoffpoint', exact: true, element: <AddDropoffPoint />},
      { path: '/view-dropoffpoint', exact: true, element: <Viewdropoffpoints /> },
      { path: '/view-dropoff', exact: true, element: <ViewDropoff />},
      { path: '/add-dropoff', exact: true, element: <AddDropoff />},

      //View All Notifications
      { path: '/all-notifiactions', exact: true, element: <Allnotificatons />},

    ],
  },
  {path:'/auth/Register', exact: true, element: <Register />},
  {path:'/auth/Login', exact: true, element: <Login/>},
  { path: '*', element: <Navigate to="/auth/404" /> },
  {
    path: '/auth',
    element: <BlankLayout />,
    children: [
      { path: '404', element: <Error /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
];

export default Router;
