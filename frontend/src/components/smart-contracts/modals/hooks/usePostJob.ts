import { ICreateContractForm } from 'components/create-contract/form/ICreateContractForm';
import { useSmartContracts } from 'components/smart-contracts/hooks/useSmartContracts';
import { SmartContractAddresses } from 'components/smart-contracts/SmartContractAddresses';
import { useWallet } from 'components/wallet/useWallet';
import { ContractReceipt, ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { pinIpfsMetaData } from 'services/ipfs';

interface UsePostJobProps {
  formData: ICreateContractForm;
  onConfirmed?: (arg0: string) => void;
  showPostJobModal: boolean;
}

export const usePostJob = (props: UsePostJobProps) => {
  const { formData, onConfirmed, showPostJobModal } = props;

  const [showIPFSModal, setShowIPFSModal] = useState(true);
  const [IPFSUploadingBegan, setIPFSUploadingBegan] = useState(false);
  const [IPFSCid, setIPFSCid] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { contracts } = useSmartContracts();
  const wallet = useWallet();

  // the logic called to initiate the transaction
  const callContract = async () => {
    const bountyWei = ethers.utils.parseUnits(formData.bounty.toString());
    const depositWei = ethers.utils.parseUnits(
      formData.requiredDeposit.toString()
    );

    return contracts.Job.postJob(
      SmartContractAddresses.PaymentToken,
      bountyWei,
      depositWei,
      IPFSCid
    );
  };

  // what to do when the transaction is confirmed on the blockchain
  const jobTxConfirmed = (receipt: ContractReceipt) => {
    const events = receipt.events;

    // extract the JobPosted event and return the new job id
    let jobId = '';
    for (const event of events || []) {
      if (event.event === 'JobPosted' && event.args) {
        jobId = event.args.jobId.toString();
        break;
      }
    }

    onConfirmed && onConfirmed(jobId);
  };

  // upload IPFS data once
  useEffect(() => {
    const createIPFSData = async () => {
      // push to the backend service
      const result = await pinIpfsMetaData({
        address: wallet.account || '',
        sig: '',
        metadata: formData,
      });

      setIPFSCid(result.ipfsCid);
      setShowIPFSModal(false);
    };

    // clear error message when closing the modal
    if (!showPostJobModal) {
      setErrorMessage('');
    }

    if (showPostJobModal && !IPFSUploadingBegan && wallet.account) {
      setIPFSUploadingBegan(true);
      createIPFSData();
    }
  }, [
    showPostJobModal,
    IPFSUploadingBegan,
    formData,
    wallet.account,
    setErrorMessage,
  ]);

  return { showIPFSModal, jobTxConfirmed, callContract, errorMessage };
};
