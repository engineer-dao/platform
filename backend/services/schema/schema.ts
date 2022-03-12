import { JSONSchemaType } from 'ajv';
import { IIPFSJobMetaData } from 'interfaces/IJobData';
import {
  ACCEPTANCE_TEST_ITEMS,
  IDENTITY_ITEMS,
  LABEL_ITEMS,
} from '../../constants/form';

export const v1: JSONSchemaType<IIPFSJobMetaData> = {
  type: 'object',
  properties: {
    version: { type: 'integer', minimum: 1 },
    title: { type: 'string', minLength: 3, maxLength: 120 },
    description: { type: 'string', minLength: 3, maxLength: 24576 },
    contactInformation: { type: 'string', maxLength: 250 },
    acceptanceCriteria: { type: 'string', minLength: 3, maxLength: 24576 },
    labels: {
      type: 'array',
      maxItems: LABEL_ITEMS.length,
      uniqueItems: true,
      items: {
        type: 'string',
        enum: LABEL_ITEMS.map((item) => item.name),
      },
    },
    identity: {
      type: 'array',
      maxItems: IDENTITY_ITEMS.length,
      uniqueItems: true,
      items: {
        type: 'string',
        enum: IDENTITY_ITEMS.map((item) => item.name),
      },
    },
    acceptanceTests: {
      type: 'array',
      maxItems: ACCEPTANCE_TEST_ITEMS.length,
      uniqueItems: true,
      items: {
        type: 'string',
        enum: ACCEPTANCE_TEST_ITEMS.map((item) => item.name),
      },
    },

    endDate: {
      type: 'string',
      pattern: '^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$',
    },
  },
  required: [
    'title',
    'description',
    'acceptanceCriteria',
    'labels',
    'identity',
    'acceptanceTests',
    'endDate',
  ],
  additionalProperties: false,
};
