// the last 8 characters of the deployed job contract
export const getSmartContractId = () => {
  const address = String(process.env.REACT_APP_JOB_CONTRACT_ADDRESS);
  return address.substring(address.length - 8).toLowerCase();
};
