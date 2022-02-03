import { createContext } from 'react';
import { INotification } from '../../interfaces/INotification';

export interface NotificationsState {
  notifications: INotification[];
}

export interface INotificationsContext extends NotificationsState {
  pushNotification: (notification: INotification) => void;
  removeNotification: (id: number) => void;
}

export const NotificationsContext = createContext<
  INotificationsContext | undefined
>(undefined);
