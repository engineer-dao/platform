import {
  ACCEPTANCE_TEST_ITEMS,
  IDENTITY_ITEMS,
  LABEL_ITEMS,
} from '../../constants/form';
import { CURRENT_SCHEMA_VERSION } from '../../constants/schema';
import { IIPFSJobMetaData, IJobMetaData } from '../../interfaces/IJobData';
import { IListBoxItem } from '../../interfaces/IListBoxItem';

export const transformIPFStoJob = (
  metadata: IIPFSJobMetaData
): IJobMetaData => {
  return {
    version: metadata.version,
    title: metadata.title,
    description: metadata.description,
    acceptanceCriteria: metadata.acceptanceCriteria,
    contactInformation: metadata.contactInformation,
    labels: transformIpfsDataToLabels(metadata.labels, LABEL_ITEMS),
    identity: transformIpfsDataToLabels(metadata.identity, IDENTITY_ITEMS),
    acceptanceTests: transformIpfsDataToLabels(
      metadata.acceptanceTests,
      ACCEPTANCE_TEST_ITEMS
    ),
    endDate: metadata.endDate,
  };
};

export const transformJobToIPFS = (
  formData: Record<string, any>
): IIPFSJobMetaData => {
  return {
    title: formData.title,
    description: formData.description,
    contactInformation: formData.contactInformation,
    acceptanceCriteria: formData.acceptanceCriteria,
    labels: transformLabelsToIpfsData(formData.labels),
    identity: transformLabelsToIpfsData(formData.identity),
    acceptanceTests: transformLabelsToIpfsData(formData.acceptanceTests),
    endDate: formData.endDate,
    version: CURRENT_SCHEMA_VERSION,
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
