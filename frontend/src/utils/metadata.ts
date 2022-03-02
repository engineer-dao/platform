import { ICreateContractForm } from 'components/create-contract/form/ICreateContractForm';
import { IIPFSJobMetaData, IJobMetaData } from 'interfaces/IJobData';
import { IListBoxItem } from 'interfaces/IListBoxItem';
import {
  acceptanceTestsItems,
  identityItems,
  labelItems,
} from 'interfaces/Labels';
import { CURRENT_SCHEMA_VERSION } from 'utils/schema';

export const createIFPSMetaDataFromFormData = (
  formData: ICreateContractForm
): IIPFSJobMetaData => {
  return {
    title: formData.title,
    description: formData.description,
    acceptanceCriteria: formData.acceptanceCriteria,
    labels: transformLabelsToIpfsData(formData.labels),
    identity: transformLabelsToIpfsData(formData.identity),
    acceptanceTests: transformLabelsToIpfsData(formData.acceptanceTests),
    endDate: formData.endDate,
    version: CURRENT_SCHEMA_VERSION,
  };
};

export const createJobMetaDataFromIPFSData = (
  metadata: IIPFSJobMetaData
): IJobMetaData => {
  return {
    version: metadata.version,
    title: metadata.title,
    description: metadata.description,
    acceptanceCriteria: metadata.acceptanceCriteria,

    labels: transformIpfsDataToLabels(metadata.labels, labelItems),
    identity: transformIpfsDataToLabels(metadata.identity, identityItems),
    acceptanceTests: transformIpfsDataToLabels(
      metadata.acceptanceTests,
      acceptanceTestsItems
    ),

    endDate: metadata.endDate,
  };
};

const transformLabelsToIpfsData = (labelItems: IListBoxItem[]) => {
  return labelItems.map((labelItem) => {
    return labelItem.name;
  });
};

const transformIpfsDataToLabels = (
  items: string[],
  options: IListBoxItem[]
): IListBoxItem[] => {
  // map option ID by string
  const optionsMap = options.reduce((acc: { [key: string]: number }, item) => {
    acc[item.name] = item.id;
    return acc;
  }, {});

  return items.map((labelItemString) => {
    return {
      id: optionsMap[labelItemString],
      name: labelItemString,
    };
  });
};
