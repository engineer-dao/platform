import Ajv, { DefinedError, JSONSchemaType } from 'ajv';
import { IIPFSJobMetaData } from '../../interfaces/IJobData';
import { CURRENT_SCHEMA_VERSION } from '../../constants/schema';
import { v1 } from './schema';

const ajv = new Ajv();

let schemas: JSONSchemaType<IIPFSJobMetaData>[] = [v1];

export interface IValidationResult {
  isValid: boolean;
  error: string | undefined;
}

export const validate = (metadata: Record<string, any>): IValidationResult => {
  const schemaVersion = parseInt(metadata.version || '0') || 0;

  const schema = loadSchemaByVersionNumber(schemaVersion);

  if (!schema) {
    return {
      isValid: false,
      error: 'Schema version not found',
    };
  }

  const validator = ajv.compile(schema);
  const isValid = validator(metadata);

  if (!isValid) {
    const errorMessages: string[] = [];

    for (const err of validator.errors as DefinedError[]) {
      let errorMessage = '';
      if (err.instancePath) {
        errorMessage = `Error in property ${err.instancePath}: `;
      }
      if (err.message) {
        errorMessage = errorMessage + err.message;
      }
      errorMessages.push(errorMessage);
    }

    return { isValid: false, error: errorMessages.join(', ') };
  }

  return { isValid: true, error: undefined };
};

const loadSchemaByVersionNumber = (schemaVersion: number) => {
  if (schemaVersion < 1 || schemaVersion > CURRENT_SCHEMA_VERSION) {
    return undefined;
  }

  return schemas[schemaVersion - 1];
};
