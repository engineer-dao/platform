import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { WalletConnectionStatus } from 'components/wallet/WalletStatus';

interface ISidebar {
  navigation: any;
}

function Sidebar(props: ISidebar) {
  const { navigation } = props;

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-gray-800">
          <div className="flex flex-1 flex-col overflow-y-auto px-2 pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4">
              <h1 className="text-2xl font-extrabold leading-6 tracking-tight text-white sm:text-4xl">
                EngineerDAO
              </h1>
            </div>
            <div className="px-2 pt-7 pb-1 text-center">
              <WalletConnectionStatus />
            </div>
            <nav className="mt-5 flex-1 space-y-1 bg-gray-800 px-2">
              {navigation.map((item: any) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={classNames(
                    item.current
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'group flex items-center rounded-md px-2 py-2 text-sm font-medium'
                  )}
                >
                  <item.icon
                    className={classNames(
                      item.current
                        ? 'text-gray-300'
                        : 'text-gray-400 group-hover:text-gray-300',
                      'mr-3 h-6 w-6 flex-shrink-0'
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
