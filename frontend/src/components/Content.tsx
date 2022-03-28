import { MenuIcon } from '@heroicons/react/outline';
import { JobProvider } from 'components/smart-contracts/JobProvider';
import { Route, Switch } from 'react-router-dom';
import { SectionPath } from '../enums/admin/Sections';
import Community from '../pages/Community';
import Contracts from '../pages/Contracts';
import { CreateContract } from '../pages/CreateContract';
import Dashboard from '../pages/Dashboard';
import { MyContracts } from '../pages/MyContracts';
import SingleContract from '../pages/SingleContract';
import Testing from '../pages/Testing';
import { isTestingEnvironment } from '../utils/testing';

interface IContent {
  reportSidebarOpen: (e: boolean) => void;
}

const Content = (props: IContent) => {
  const { reportSidebarOpen } = props;
  return (
    <div className="flex w-0 flex-1 flex-col overflow-hidden">
      <div className="pl-1 pt-1 sm:pl-3 sm:pt-3 md:hidden">
        <button
          type="button"
          className="focus:outline-none -ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          onClick={() => reportSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <MenuIcon className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      <main className="focus:outline-none relative z-0 flex-1 overflow-y-auto">
        <div className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
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
                  <JobProvider>
                    <SingleContract />
                  </JobProvider>
                </Route>
                <Route path={SectionPath.createContract} exact>
                  <CreateContract />
                </Route>
                {isTestingEnvironment() && (
                  <Route path={SectionPath.testing} exact>
                    <Testing />
                  </Route>
                )}
              </Switch>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Content;
