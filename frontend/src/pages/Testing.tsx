import { useNotifications } from '../components/notifications/useNotifications';

const Dashboard = () => {
  const { pushNotification } = useNotifications();
  return (
    <div>
      <h2 className="mb-6">Testing</h2>
      <button
        onClick={() =>
          pushNotification({
            open: true,
            heading: 'Here is a note',
            content: 'This is some text',
          })
        }
      >
        Open Notification
      </button>
    </div>
  );
};

export default Dashboard;
