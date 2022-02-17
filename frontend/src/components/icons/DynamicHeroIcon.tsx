import * as HeroIcons from '@heroicons/react/solid';

type IconName = keyof typeof HeroIcons;
interface IconProps {
  icon: IconName;
  className?: string;
}

export const DynamicHeroIcon = ({ icon, className }: IconProps) => {
  const SingleIcon = HeroIcons[icon];

  return <SingleIcon className={className} aria-hidden="true" />;
};
