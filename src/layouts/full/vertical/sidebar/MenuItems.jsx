import {
  IconUsers,
  IconBookmark,
  IconInbox,
  IconAperture,
  IconClock,
  IconDragDrop,
  IconDropCircle,
  IconTruckDelivery,
  IconTruckLoading,
  IconPackage
} from '@tabler/icons';

import { uniqueId } from 'lodash';

const Menuitems = [
  {
    navlabel: true,
    subheader: 'Dashboard',
  },
  {
    id: uniqueId(),
    title: 'Home',
    icon: IconAperture,
    href: '/home',
    chipColor: 'secondary',
  },
  {
    id: uniqueId(),
    title: 'Users',
    icon: IconUsers,
    href: '/users',
  },
  {
    id: uniqueId(),
    title: 'Driver',
    icon: IconUsers,
    href: '/driver',
  },
  {
    id: uniqueId(),
    title: 'Invites',
    icon: IconInbox,
    href: '/invites',
  },
  {
    id: uniqueId(),
    title: ' Time Slots',
    icon: IconClock,
    href: '/timeSlots',
    // href:'/temptimeslot',
  },
  {
    id: uniqueId(),
    title: 'Pickups',
    icon: IconTruckDelivery,
    href: '/pickups',
  },
  {
    id: uniqueId(),
    title: 'Offload Points',
    icon:IconTruckLoading,
    href:'/offloadpoints',
  },
  {
    id: uniqueId(),
    title: 'Dropoff Points',
    icon:IconPackage,
    href:'/dropoffpoints',
  },
  {
    id: uniqueId(),
    title: 'Settings',
    icon:IconPackage,
    href:'/settings',
  },



];

export default Menuitems;
