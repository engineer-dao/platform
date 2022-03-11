interface IPostComment {
  sig: string;
  address: string;
  message: string;
  contract_id: string;
}

export const postComment = async ({
  sig,
  address,
  message,
  contract_id,
}: IPostComment) => {
  return await fetch(`${process.env.REACT_APP_API}/api/activity/message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sig,
      address,
      message,
      contract_id,
      type: 'comment',
    }),
  });
};

export const syncEvents = async () => {
  return await fetch(`${process.env.REACT_APP_API}/api/activity/syncEvents`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
