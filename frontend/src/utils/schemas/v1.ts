import { JSONSchemaType } from 'ajv';
import { IIPFSJobMetaData } from 'interfaces/IJobData';
import {
  acceptanceTestsItems,
  identityItems,
  labelItems,
} from 'interfaces/Labels';

export const schema_v1: JSONSchemaType<IIPFSJobMetaData> = {
  type: 'object',
  properties: {
    version: { type: 'integer', minimum: 1 },
    title: { type: 'string', minLength: 3, maxLength: 120 },
    description: { type: 'string', minLength: 3, maxLength: 24576 },
    acceptanceCriteria: { type: 'string', minLength: 3, maxLength: 24576 },
    labels: {
      type: 'array',
      minItems: 1,
      maxItems: labelItems.length,
      uniqueItems: true,
      items: {
        type: 'string',
        enum: labelItems.map((item) => item.name),
      },
    },
    identity: {
      type: 'array',
      minItems: 1,
      maxItems: identityItems.length,
      uniqueItems: true,
      items: {
        type: 'string',
        enum: identityItems.map((item) => item.name),
      },
    },
    acceptanceTests: {
      type: 'array',
      minItems: 1,
      maxItems: acceptanceTestsItems.length,
      uniqueItems: true,
      items: {
        type: 'string',
        enum: acceptanceTestsItems.map((item) => item.name),
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
