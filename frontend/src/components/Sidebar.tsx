import classNames from 'classnames';
import { Link } from 'react-router-dom';
import WalletConnectionStatus from './wallet/WalletConnectionStatus';

interface ISidebar {
  navigation: any;
}

function Sidebar(props: ISidebar) {
  const { navigation } = props;

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col">
        <div className="flex-1 flex flex-col min-h-0 bg-gray-800">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto px-2">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-2xl leading-6 font-extrabold tracking-tight text-white sm:text-4xl">
                EngineerDAO
              </h1>
            </div>
            <nav className="mt-5 flex-1 px-2 bg-gray-800 space-y-1">
              {navigation.map((item: any) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={classNames(
                    item.current
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                  )}
                >
                  <item.icon
                    className={classNames(
                      item.current
                        ? 'text-gray-300'
                        : 'text-gray-400 group-hover:text-gray-300',
                      'mr-3 flex-shrink-0 h-6 w-6'
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
              <div className="px-2 py-2 pt-7">
                <WalletConnectionStatus />
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
