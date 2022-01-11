import { useState } from 'react';
import { ClipboardIcon, HomeIcon } from '@heroicons/react/outline';
import Sidebar from '../components/Sidebar';
import Content from '../components/Content';
import { useLocation } from 'react-router-dom';
import { SectionPath } from '../enums/admin/Sections';
import MobileSidebar from '../components/MobileSidebar';

export default function Admin() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
  ];

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      <MobileSidebar
        sidebarOpen={sidebarOpen}
        reportSidebarOpen={setSidebarOpen}
        navigation={navigation}
      />
      <Sidebar navigation={navigation} />
      <Content reportSidebarOpen={setSidebarOpen} />
    </div>
  );
}
