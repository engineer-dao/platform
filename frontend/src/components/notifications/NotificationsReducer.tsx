import { INotification } from '../../interfaces/INotification';
import { NotificationsState } from './NotificationsContext';

export const notificationsReducer = (
  state: NotificationsState,
  action: NotificationsAction
): NotificationsState => {
  switch (action.type) {
    case 'push_notification': {
      const notification = {
        id: state?.notifications?.length + 1,
        ...action.payload,
      };

      return {
        ...state,
        notifications: [...state.notifications, notification],
      };
    }
    case 'remove_notification': {
      return {
        ...state,
        notifications: state.notifications.filter(
          (item) => item.id !== action.payload
        ),
      };
    }
    default: {
      return state;
    }
  }
};

export type NotificationsAction =
  | {
      type: 'push_notification';
      payload: INotification;
    }
  | {
      type: 'remove_notification';
      payload: number;
    };
