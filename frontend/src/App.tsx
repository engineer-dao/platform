import { BrowserRouter as Router } from 'react-router-dom';
import { NotificationsProvider } from './components/notifications/NotificationsProvider';
import { MoralisWalletProvider } from './components/wallet/MoralisWalletProvider';
import Admin from './pages/Admin';

function App() {
  return (
    <MoralisWalletProvider>
      <NotificationsProvider>
        <Router>
          <Admin />
        </Router>
      </NotificationsProvider>
    </MoralisWalletProvider>
  );
}

export default App;
