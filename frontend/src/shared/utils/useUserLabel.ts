import { userProps } from '@shared/types/user';

export const useUserLabel = (user: userProps) => {
  const membership = user?.membership;

  const isPrivateRole = user?.role == 'private';
  const isDealerRole = user?.role == 'dealer';
  const isMember = membership?.is_member_package || isPrivateRole;
  const isDealer = membership?.is_dealer_package || isDealerRole;
  const isVIPMember = membership?.has_vip_seller_label;
  const isDealerPremium = membership?.has_premium_dealer_label;
  const isDealerVIP = membership?.has_trusted_dealer_label;
  const isHasProfile = membership?.has_profile;

  const isSpecialMember = isVIPMember || isDealerPremium || isDealerVIP;

  const label =
    isDealerPremium
      ? 'Dealer Premium'
      : isDealerVIP
      ? 'Trusted Dealer'
      : isVIPMember
      ? 'VIP Seller'
      : isDealer
      ? 'Dealer'
      : isMember
      ? 'Seller'
      : 'User';

  const labelColorClass = isVIPMember
    ? '!text-blue-600'
    : isDealerVIP
    ? '!text-yellow-600'
    : isDealerPremium
    ? '!text-orange-600'
    : isMember || isDealer
    ? 'text-gray-600'
    : '';

  const borderColorClass = isVIPMember
    ? '!border-blue-500'
    : isDealerVIP
    ? '!border-yellow-500'
    : isDealerPremium
    ? '!border-orange-500'
    : isMember || isDealer
    ? 'border-gray-300'
    : '';

  return {
    isMember,
    isDealer,
    isVIPMember,
    isDealerPremium,
    isDealerVIP,
    isSpecialMember,
    label,
    labelColorClass,
    borderColorClass,
    isHasProfile
  };
};
