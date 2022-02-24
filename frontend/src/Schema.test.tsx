import * as schema from 'utils/schema';

const SCHEMA_VERSION = 1;

const goodData = {
  version: SCHEMA_VERSION,
  title: 'good title',
  description: 'good description',
  acceptanceCriteria: 'good acceptance criteria',
  requiredDeposit: 100,
  labels: ['Backend'],
  identity: ['Optionally Anon'],
  acceptanceTests: ['Test Coverage Requirement'],
  endDate: '2022-02-22',
};

const validateJson = (json: any) => {
  let parsedJson;
  if (typeof json === 'string') {
    parsedJson = JSON.parse(json);
  } else {
    parsedJson = json;
  }

  return schema.validateMetaData(parsedJson);
};

test('validates and parses json', () => {
  expect(validateJson(goodData)).toEqual({
    isValid: true,
    error: undefined,
  });
});

test('catches errors for invalid json', () => {
  const removeKey = (k: string, { [k]: _, ...o }) => {
    return o;
  };

  const testError = (json: any, expectedError: string) => {
    expect(validateJson(json)).toEqual({
      isValid: false,
      error: expectedError,
    });
  };

  testError(
    { ...goodData, version: 2 },
    'Schema version not found'
  );
  testError(
    { ...goodData, version: 'x' },
    'Schema version not found'
  );
  testError(
    { ...goodData, version: NaN },
    'Schema version not found'
  );
  testError(
    { ...goodData, version: 0 },
    'Schema version not found'
  );
  testError(
    removeKey('title', goodData),
    "must have required property 'title'"
  );
  testError(
    { ...goodData, title: '' },
    'Error in property /title: must NOT have fewer than 3 characters'
  );
  testError(
    { ...goodData, description: '' },
    'Error in property /description: must NOT have fewer than 3 characters'
  );
  testError(
    { ...goodData, badtitle: 'xyz' },
    'must NOT have additional properties'
  );
  testError(
    { ...goodData, title: 'x'.repeat(121) },
    'Error in property /title: must NOT have more than 120 characters'
  );
  testError(
    { ...goodData, description: 'x'.repeat(24576 + 1) },
    'Error in property /description: must NOT have more than 24576 characters'
  );
  testError(
    { ...goodData, acceptanceCriteria: 'x'.repeat(24576 + 1) },
    'Error in property /acceptanceCriteria: must NOT have more than 24576 characters'
  );
  testError(
    { ...goodData, requiredDeposit: 'bad' },
    'Error in property /requiredDeposit: must be integer'
  );
  testError(
    { ...goodData, requiredDeposit: 0 },
    'Error in property /requiredDeposit: must be >= 1'
  );
  testError(
    { ...goodData, requiredDeposit: 1000000000 },
    'Error in property /requiredDeposit: must be <= 999999999'
  );
  testError(
    { ...goodData, endDate: '' },
    'Error in property /endDate: must match pattern "^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$"'
  );
  testError(
    { ...goodData, endDate: 'z123-02-02' },
    'Error in property /endDate: must match pattern "^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$"'
  );
  testError(
    { ...goodData, endDate: '2022-99-99' },
    'Error in property /endDate: must match pattern "^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$"'
  );
  testError(
    { ...goodData, labels: 'bad' },
    'Error in property /labels: must be array'
  );
  testError(
    { ...goodData, labels: ['bad'] },
    'Error in property /labels/0: must be equal to one of the allowed values'
  );
  testError(
    { ...goodData, labels: ['Backend', 'Frontend', 'Backend'] },
    'Error in property /labels: must NOT have duplicate items (items ## 2 and 0 are identical)'
  );
  testError(
    { ...goodData, identity: ['bad'] },
    'Error in property /identity/0: must be equal to one of the allowed values'
  );
  testError(
    { ...goodData, acceptanceTests: ['bad'] },
    'Error in property /acceptanceTests/0: must be equal to one of the allowed values'
  );
});
