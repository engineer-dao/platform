const LoadingSkeleton: React.FC = () => {
  return (
    <div className="mt-4 flex animate-pulse overflow-hidden border-t border-gray-200 bg-white p-4 shadow sm:rounded-lg sm:px-6 sm:py-5">
      <div className="relative">
        <div className="mr-4 h-10 w-10 rounded-full bg-gray-100" />
      </div>
      <div className="w-full min-w-0 flex-1 rounded-md bg-gray-100" />
    </div>
  );
};

export default LoadingSkeleton;
