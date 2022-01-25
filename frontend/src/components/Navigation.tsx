import classNames from 'classnames';

const Navigation = (props: any) => {
  const { navigation } = props;

  return (
    <div className="h-0 flex-1 overflow-y-auto pt-5 pb-4">
      <div className="flex flex-shrink-0 items-center px-4">
        <h1 className="text- font-extrabold leading-6 tracking-tight text-white sm:text-4xl">
          EngineerDAO
        </h1>
      </div>
      <nav className="mt-5 space-y-1 px-2">
        {navigation.map((item: any) => (
          <a
            key={item.name}
            href={item.href}
            className={classNames(
              item.current
                ? 'bg-gray-900 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
              'group flex items-center rounded-md px-2 py-2 text-base font-medium'
            )}
          >
            <item.icon
              className={classNames(
                item.current
                  ? 'text-gray-300'
                  : 'text-gray-400 group-hover:text-gray-300',
                'mr-4 h-6 w-6 flex-shrink-0'
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
