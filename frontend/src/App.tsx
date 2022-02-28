import { BrowserRouter as Router } from 'react-router-dom';
import { NotificationsProvider } from './components/notifications/NotificationsProvider';
import { SingleContractProvider } from './components/single-contract/context/SingleContractProvider';
import { WalletProvider } from './components/wallet/WalletProvider';
import Admin from './pages/Admin';

function App() {
  return (
    <Router>
      <WalletProvider>
        <NotificationsProvider>
          <SingleContractProvider>
            <Admin />
          </SingleContractProvider>
        </NotificationsProvider>
      </WalletProvider>
    </Router>
  );
}

export default App;
