import { useState } from 'react';
import {
  ClipboardCheckIcon,
  ClipboardIcon,
  HomeIcon,
  BeakerIcon,
} from '@heroicons/react/outline';
import Sidebar from '../components/Sidebar';
import Content from '../components/Content';
import { useLocation } from 'react-router-dom';
import { SectionPath } from '../enums/admin/Sections';
import MobileSidebar from '../components/MobileSidebar';
import { SmartContractsProvider } from 'components/smart-contracts/SmartContractsProvider';
import { useNotifications } from '../components/notifications/useNotifications';
import { Notification } from '../components/notifications/Notification';
import { isTestingEnvironment } from '../utils/testing';

export default function Admin() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const current = (id: string) => location.pathname === id;

  const { notifications } = useNotifications();

  const navigation = [
    {
      name: 'Dashboard',
      href: SectionPath.dashboard,
      icon: HomeIcon,
      current: current(SectionPath.dashboard),
    },
    {
      name: 'Contracts',
      href: SectionPath.contracts,
      icon: ClipboardIcon,
      current: current(SectionPath.contracts),
    },
    {
      name: 'My Contracts',
      href: SectionPath.myContracts,
      icon: ClipboardCheckIcon,
      current: current(SectionPath.myContracts),
    },
  ];

  if (isTestingEnvironment()) {
    navigation.push({
      name: 'Testing',
      href: SectionPath.testing,
      icon: BeakerIcon,
      current: current(SectionPath.testing),
    });
  }

  return (
    <SmartContractsProvider>
      <div className="flex h-screen overflow-hidden bg-gray-100">
        <MobileSidebar
          sidebarOpen={sidebarOpen}
          reportSidebarOpen={setSidebarOpen}
          navigation={navigation}
        />
        <Sidebar navigation={navigation} />
        <Content reportSidebarOpen={setSidebarOpen} />
        {notifications.map((notification, index) => (
          <Notification
            notification={notification}
            key={`notification-${index}`}
          />
        ))}
      </div>
    </SmartContractsProvider>
  );
}
