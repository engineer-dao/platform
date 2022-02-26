import Ajv, { DefinedError, JSONSchemaType } from 'ajv';
import { IIPFSJobMetaData } from 'interfaces/IJobData';
import { schema_v1 } from 'utils/schemas/v1';

const ajv = new Ajv();

export const CURRENT_SCHEMA_VERSION = 1;

// load all historical schema versions
let schemas: JSONSchemaType<IIPFSJobMetaData>[] = [schema_v1];

export interface IValidationResult {
  isValid: boolean;
  error: string | undefined;
}

export const validateMetaData = (metadata: any): IValidationResult => {
  // determine schema version
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
