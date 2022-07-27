import Resources from '../components/dashboard/Resources';

const Dashboard = () => {
  return (
    <div className="flex flex-col items-center justify-center pt-10">
      <h2 className="w-full text-center text-3xl font-extrabold tracking-tight text-gray-900 md:text-6xl">
        <span className="block">Welcome to</span>
        <span className="block text-indigo-600">the future of work.</span>
      </h2>
      <p className="mt-10 max-w-3xl items-center text-center text-lg text-gray-900">
        Stable is an anonymous, permissionless marketplace for software
        engineers to match with paid bounties. Built with &#10084; by
        EngineerDAO, we're obsessed with manifesting the "Internet of Jobs"
        through decentralized tools and collaborations.
        <br />
        <br />
        <strong>
          Join us today to leave the corporate world and start your on-chain
          career!
        </strong>
      </p>
      <Resources />
    </div>
  );
};

export default Dashboard;
