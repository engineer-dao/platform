import {
  AcademicCapIcon,
  AtSymbolIcon,
  ChatIcon,
  CodeIcon,
  CogIcon,
  DocumentTextIcon,
} from '@heroicons/react/outline';

const Resources = () => {
  const resources = [
    {
      name: 'Documentation',
      link: 'https://engineerdao.notion.site/EngineerDAO-3725e0e5db6c496f9f04615bd604ac58',
      icon: DocumentTextIcon,
    },
    {
      name: 'Philosophy',
      link: 'https://engineerdao.notion.site/Philosophy-bbdcbd3ce17e40aea62fa61f2441572f',
      icon: AcademicCapIcon,
    },
    {
      name: 'How It Works',
      link: 'https://engineerdao.notion.site/How-It-Works-6ce13129b9244abf981b41666b90797e',
      icon: CogIcon,
    },
    {
      name: 'Discord',
      link: 'https://discord.gg/2Tgdjjech7',
      icon: ChatIcon,
    },
    { name: 'Github', link: 'https://github.com/engineer-dao', icon: CodeIcon },
    {
      name: 'Contact Us',
      link: 'mailto:support@engineerdao.com',
      icon: AtSymbolIcon,
    },
  ];

  return (
    <div className="relative mt-16 w-full px-4 text-center sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {resources.map((resource) => (
          <a
            href={resource.link}
            target="_blank"
            rel="noreferrer"
            key={resource.name}
          >
            <div className="pt-6">
              <div className="flow-root rounded-lg bg-gray-50 px-6 pb-8 transition-transform hover:shadow-md">
                <div className="-mt-6">
                  <div>
                    <span className="inline-flex items-center justify-center rounded-md bg-indigo-500 p-3 shadow-lg">
                      <resource.icon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                  <h3 className="mt-8 text-lg font-medium tracking-tight text-gray-900">
                    {resource.name}
                  </h3>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Resources;
