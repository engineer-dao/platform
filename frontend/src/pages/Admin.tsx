import { useState } from 'react';
import {
  ClipboardCheckIcon,
  ClipboardIcon,
  HomeIcon,
  UserGroupIcon,
} from '@heroicons/react/outline';
import Sidebar from '../components/Sidebar';
import Content from '../components/Content';
import { useLocation } from 'react-router-dom';
import { SectionPath } from '../enums/admin/Sections';
import MobileSidebar from '../components/MobileSidebar';
import { WalletContext } from 'lib/wallet/WalletContext';
import { DefaultWalletConnection } from 'lib/wallet/WalletConnection';

export default function Admin() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [walletConnection, setWalletConnection] = useState(
    DefaultWalletConnection
  );
  const defaultWalletConnectionValue = {
    walletConnection,
    setWalletConnection,
  };
  const location = useLocation();

  const current = (id: string) => location.pathname === id;

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
    {
      name: 'Community',
      href: SectionPath.community,
      icon: UserGroupIcon,
      current: current(SectionPath.community),
    },
  ];

  return (
    <WalletContext.Provider value={defaultWalletConnectionValue}>
      <div className="h-screen flex overflow-hidden bg-gray-100">
        <MobileSidebar
          sidebarOpen={sidebarOpen}
          reportSidebarOpen={setSidebarOpen}
          navigation={navigation}
        />
        <Sidebar navigation={navigation} />
        <Content reportSidebarOpen={setSidebarOpen} />
      </div>
    </WalletContext.Provider>
  );
}
