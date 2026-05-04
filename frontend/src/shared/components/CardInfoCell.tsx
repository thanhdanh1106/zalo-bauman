import {
  FaCcAmex,
  FaCcDiscover,
  FaCcMastercard,
  FaCcStripe,
  FaCreditCard,
} from 'react-icons/fa';

function CardInfoCell({ card, type }: { card?: any; type?: string }) {
  if (!card) {
    return <div className="text-sm text-gray-500 italic">No card info</div>;
  }

  const getCardIconSVG = (brand: string) => {
    switch (brand.toLowerCase()) {
      case 'visa':
        return <FaCreditCard size={22} className="" />;
      case 'mastercard':
        return <FaCcMastercard size={22} className="" />;
      case 'amex':
        return <FaCcAmex size={22} className="" />;
      case 'discover':
        return <FaCcDiscover size={22} className="" />;
      default:
        return <FaCcStripe size={22} className="" />; // Fallback icon (generic credit card)
    }
  };

  return (
    <div className="flex items-center">
      {getCardIconSVG(card.brand)}
      <div className="ml-3">
        <div className="text-sm font-medium text-gray-900  capitalize">
          {card.brand} **** {card.last4}
        </div>
        <div className="text-xs text-gray-500">
          {type === 'card' ? 'Credit/Debit Card' : card.installments}
        </div>
      </div>
    </div>
  );
}

export default CardInfoCell;


