import classNames from 'classnames';
import { utils } from 'ethers';
import { Field, Form, Formik } from 'formik';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { ISingleContractRouteParams } from '../../interfaces/routes/ISingleContractRouteParams';
import { postComment } from '../../services/activityFeed';
import { useNotifications } from '../notifications/useNotifications';
import { useWallet } from '../wallet/useWallet';

interface IMessageForm {
  message: string;
}

const NewMessage = () => {
  const { id } = useParams<ISingleContractRouteParams>();
  const { provider, account } = useWallet();
  const { pushNotification } = useNotifications();

  const signer = useMemo(() => provider?.getSigner(), [provider]);

  const handleSubmit = async (message: string) => {
    const sig = await signer?.signMessage(message);
    const address = utils.getAddress(account || '');

    if (sig && address) {
      try {
        const response = await postComment({
          sig,
          address,
          message,
          contract_id: id,
        });

        if (response.status !== 200) {
          // handle 403 unauthorized
          if (response.status === 403) {
            const json = await response.json();
            if (json?.message) {
              pushNotification({
                heading: 'Error',
                content: json.message,
              });
            }
            return false;
          }

          // some other error
          throw new Error(`${response.status} Error`);
        }

        // success
        pushNotification({
          heading: 'Success',
          content: 'Message posted successfully.',
        });
        return true;
      } catch (e) {
        pushNotification({
          heading: 'Error',
          content: `There was an error: ${e}`,
        });
      }
    }

    return false;
  };

  const initialValues: IMessageForm = { message: '' };

  return (
    <div className="mt-8 flex items-start space-x-4">
      <div className="min-w-0 flex-1">
        <Formik
          enableReinitialize
          initialValues={initialValues}
          onSubmit={async (values, { resetForm }) => {
            const submitted = await handleSubmit(values.message);
            if (submitted) {
              resetForm();
            }
          }}
        >
          {({ values, isSubmitting }) => {
            const isDisabled = isSubmitting && !values.message;

            return (
              <Form className="relative">
                <div className="overflow-hidden rounded-lg border border-gray-300 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
                  <label htmlFor="comment" className="sr-only">
                    Add a comment
                  </label>
                  <Field
                    rows={3}
                    name="message"
                    id="message"
                    as="textarea"
                    className="block w-full resize-none border-0 py-3 focus:ring-0 sm:text-sm"
                    placeholder="Add a comment"
                  />

                  {/* Spacer element to match the height of the toolbar */}
                  <div className="py-2" aria-hidden="true">
                    <div className="py-px">
                      <div className="h-9" />
                    </div>
                  </div>
                </div>

                <div className="absolute inset-x-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
                  <div className="flex items-center space-x-5"></div>
                  <div className="flex-shrink-0">
                    <button
                      type="submit"
                      disabled={isDisabled}
                      className={classNames({
                        'focus:outline-none inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2':
                          true,
                        'bg-indigo-300': isDisabled,
                        'bg-indigo-600 hover:bg-indigo-700': !isDisabled,
                      })}
                    >
                      Post
                    </button>
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default NewMessage;
