import classNames from 'classnames';

const Navigation = (props: any) => {
  const { navigation } = props;

  return (
    <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
      <div className="flex-shrink-0 flex items-center px-4">
        <h1 className="text- leading-6 font-extrabold tracking-tight text-white sm:text-4xl">
          EngineerDAO
        </h1>
      </div>
      <nav className="mt-5 px-2 space-y-1">
        {navigation.map((item: any) => (
          <a
            key={item.name}
            href={item.href}
            className={classNames(
              item.current
                ? 'bg-gray-900 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
              'group flex items-center px-2 py-2 text-base font-medium rounded-md'
            )}
          >
            <item.icon
              className={classNames(
                item.current
                  ? 'text-gray-300'
                  : 'text-gray-400 group-hover:text-gray-300',
                'mr-4 flex-shrink-0 h-6 w-6'
              )}
              aria-hidden="true"
            />
            {item.name}
          </a>
        ))}
      </nav>
    </div>
  );
};

export default Navigation;
