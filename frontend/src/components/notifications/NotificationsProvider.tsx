import React, { useMemo, useReducer } from 'react';
import {
  NotificationsContext,
  NotificationsState,
} from './NotificationsContext';
import { INotification } from '../../interfaces/INotification';
import { notificationsReducer } from './NotificationsReducer';

const initialState: NotificationsState = {
  notifications: [],
};

export const NotificationsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(notificationsReducer, initialState);

  const pushNotification = (payload: INotification) => {
    dispatch({
      type: 'push_notification',
      payload,
    });
  };

  const removeNotification = (payload: number) => {
    dispatch({
      type: 'remove_notification',
      payload,
    });
  };

  const contextValue = useMemo(
    () => ({
      ...state,
      pushNotification,
      removeNotification,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state]
  );

  return (
    <NotificationsContext.Provider value={contextValue}>
      {children}
    </NotificationsContext.Provider>
  );
};
