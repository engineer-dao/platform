import { ResolveForEngineerButton } from 'components/single-contract/dr-form-components/ResolveForEngineerButton';
import { ResolveForSupplierButton } from 'components/single-contract/dr-form-components/ResolveForSupplierButton';
import { ResolveWithSplitButton } from 'components/single-contract/dr-form-components/ResolveWithSplitButton';
import { useJob } from 'components/smart-contracts/hooks/useJob';

export const DisputeResolverForm = () => {
  const { job, isLoading } = useJob();

  return !isLoading && job ? (
    <>
      <div className="mt-6 overflow-hidden shadow sm:rounded-md">
        <div className="bg-white px-4 py-5 sm:p-6">
          <div className="grid grid-cols-6 gap-6">
            <ResolveForSupplierButton />
            <ResolveForEngineerButton />
            <ResolveWithSplitButton />
          </div>
        </div>
      </div>
    </>
  ) : null;
};
