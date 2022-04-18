import Resources from '../components/dashboard/Resources';

const Dashboard = () => {
  return (
    <div className="flex flex-col items-center justify-center pt-10">
      <h2 className="w-full text-center text-3xl font-extrabold tracking-tight text-gray-900 md:text-6xl">
        <span className="block">Welcome to</span>
        <span className="block text-indigo-600">the future of work.</span>
      </h2>
      <p className="mt-10 max-w-3xl items-center text-center text-lg text-gray-900">
        EngineerDAO is a product-focused DAO obsessed with manifesting the
        "Internet of Jobs". Our product is an anonymous, permissionless
        marketplace for software engineers to match with paid projects, tasks,
        and jobs.
      </p>
      <Resources />
    </div>
  );
};

export default Dashboard;
