import PricingTable from '@/Pages/Pricing/PricingTable';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TbLockAccess } from 'react-icons/tb';

type InvalidroleProps = {
  message?: string;
};

const Invalidrole: React.FC<InvalidroleProps> = ({
  message = 'No items found.',
}) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center p-8 ">
      <div className="text-center">
        <TbLockAccess className="text-6xl mb-4 mx-auto text-gray-500 " />
        <h2 className="text-xl font-semibold">
          {t('You need to upgrade to access this content')}
        </h2>
        <p className="text-gray-400  mt-2 max-w-md">
          {t(
            'This feature is only available to users who have subscribed to the appropriate package. Please select a service package below to continue using it.'
          )}
        </p>
      </div>
      <div className="w-full max-w-6xl mt-6">
        <PricingTable />
      </div>
    </div>
  );
};

export default Invalidrole;


