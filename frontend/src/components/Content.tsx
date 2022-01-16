import { MenuIcon } from '@heroicons/react/outline';
import { Route, Switch } from 'react-router-dom';
import { SectionPath } from '../enums/admin/Sections';
import Community from '../pages/Community';
import Contracts from '../pages/Contracts';
import Dashboard from '../pages/Dashboard';
import MyContracts from '../pages/MyContracts';
import SingleContract from '../pages/SingleContract';

interface IContent {
  reportSidebarOpen: (e: boolean) => void;
}

const Content = (props: IContent) => {
  const { reportSidebarOpen } = props;
  return (
    <div className="flex flex-col w-0 flex-1 overflow-hidden">
      <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
        <button
          type="button"
          className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          onClick={() => reportSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <MenuIcon className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="py-4">
              <Switch>
                <Route path={SectionPath.dashboard} exact>
                  <Dashboard />
                </Route>
                <Route path={SectionPath.contracts} exact>
                  <Contracts />
                </Route>
                <Route path={SectionPath.myContracts} exact>
                  <MyContracts />
                </Route>
                <Route path={SectionPath.community} exact>
                  <Community />
                </Route>
                <Route path={SectionPath.contract}>
                  <SingleContract />
                </Route>
              </Switch>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Content;
