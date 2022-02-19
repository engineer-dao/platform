import * as HeroIcons from '@heroicons/react/outline';
type IconName = keyof typeof HeroIcons;

export interface IModalProps {
  isOpen: boolean;
  icon?: IconName;
  iconColor?: 'red' | 'green';
  title?: React.ReactNode;
  children?: React.ReactNode;
  closeButton?: React.ReactNode;
  onRequestClose?: Function;
}
