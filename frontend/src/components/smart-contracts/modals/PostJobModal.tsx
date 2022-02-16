import { CreateFormValues } from 'components/forms/types';
import { useSmartContracts } from 'components/smart-contracts/hooks/useSmartContracts';
import { TransactionModal } from 'components/smart-contracts/modals/TransactionModal';
import { SmartContractAddresses } from 'components/smart-contracts/SmartContractAddresses';
import { Modal } from 'components/ui/Modal';
import { useWallet } from 'components/wallet/useWallet';
import { BigNumber, ContractReceipt, ethers } from 'ethers';
import { ITransactionModalProps } from 'interfaces/ITransactionModalProps';
import React, { useEffect, useState } from 'react';
import { pinIpfsMetaData } from 'services/ipfs';

interface IProps extends ITransactionModalProps {
  formData: CreateFormValues;
}

export const PostJobModal = (props: IProps) => {
  const [showIPFSModal, setShowIPFSModal] = useState(true);
  const [IPFSUploadingBegan, setIPFSUploadingBegan] = useState(false);
  const [IPFSDigest, setIPFSDigest] = useState(BigNumber.from(0));
  const { formData, show, onFinish, onConfirmed, onError } = props;

  const { contracts } = useSmartContracts();
  const wallet = useWallet();

  // the logic called to initiate the transaction
  const callContract = async () => {
    const bountyWei = ethers.utils.parseUnits(formData.bounty.toString());

    const depositPct = 1000; // TODO - hook this up to the form value
    return contracts.Job.postJob(
      SmartContractAddresses.PaymentToken,
      bountyWei,
      depositPct,
      IPFSDigest
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
      const metadata = {
        title: formData.title,
        description: formData.description,
        buyIn: parseInt(formData.buyIn),
        acceptanceCriteria: formData.acceptanceCriteria,
      };

      // push to the backend service
      const result = await pinIpfsMetaData({
        address: wallet.account || '',
        sig: '',
        metadata,
      });

      setIPFSDigest(result.ipfsHashDigest);
      setShowIPFSModal(false);
    };

    if (show && !IPFSUploadingBegan && wallet.account) {
      setIPFSUploadingBegan(true);
      createIPFSData();
    }
  }, [show, IPFSUploadingBegan, formData, wallet.account]);

  // show the IPFS modal first
  // then the transaction modal
  return (
    <>
      <Modal
        title="Uploading Job Data"
        icon="CloudUploadIcon"
        isOpen={show && showIPFSModal}
      >
        <p>Uploading the job data. Please wait a few seconds.</p>
      </Modal>
      <TransactionModal
        title="Post a New Job"
        onConfirmed={jobTxConfirmed}
        show={show && !showIPFSModal}
        {...{ callContract, onFinish, onError }}
      />
    </>
  );
};
