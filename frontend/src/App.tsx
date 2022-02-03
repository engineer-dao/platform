import { BrowserRouter as Router } from 'react-router-dom';
import { NotificationsProvider } from './components/notifications/NotificationsProvider';
import { WalletProvider } from './components/wallet/WalletProvider';
import Admin from './pages/Admin';

function App() {
  return (
    <WalletProvider>
      <NotificationsProvider>
        <Router>
          <Admin />
        </Router>
      </NotificationsProvider>
    </WalletProvider>
  );
}

export default App;
