import {
  applyPromotion,
  clearPromotionError,
  removePromotion,
  selectAppliedPromotion,
  selectPromotionError,
  setPromotionError,
} from "@shared/store/slices/cartSlice";
import { promotionProps } from "@shared/types/promotion";
import { applyPromotionCode } from "@shared/utils/Promotions";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface PromoCodeFormProps {
  className?: string;
  onSuccess?: (promotion: promotionProps) => void;
  onError?: (error: string) => void;
}

const PromoCodeForm: React.FC<PromoCodeFormProps> = ({
  className = "",
  onSuccess,
  onError,
}) => {
  const dispatch = useDispatch();
  const appliedPromotion = useSelector(selectAppliedPromotion);
  const promotionError = useSelector(selectPromotionError);

  const [promoCode, setPromoCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!promoCode.trim()) {
      dispatch(setPromotionError("Vui lòng nhập mã giảm giá"));
      return;
    }

    setIsLoading(true);
    dispatch(clearPromotionError());

    try {
      const response = await applyPromotionCode(promoCode.trim());

      if (response.error) {
        const errorMessage = response.message || "Mã giảm giá không hợp lệ";
        dispatch(setPromotionError(errorMessage));
        onError?.(errorMessage);
        return;
      }

      const promotion: promotionProps = response.data || response;

      // Apply promotion
      dispatch(applyPromotion(promotion));
      setPromoCode("");
      onSuccess?.(promotion);
    } catch (error) {
      console.error("Error applying promotion:", error);
      const errorMessage = "Có lỗi xảy ra khi áp dụng mã giảm giá";
      dispatch(setPromotionError(errorMessage));
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemovePromotion = () => {
    dispatch(removePromotion());
    setPromoCode("");
    dispatch(clearPromotionError());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPromoCode(e.target.value.toUpperCase());
    if (promotionError) {
      dispatch(clearPromotionError());
    }
  };

  return (
    <div className={`${className}`}>
      {appliedPromotion ? (
        <div className="flex items-center justify-between bg-green-50 p-3 rounded-xl border border-green-100">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-green-600 text-[20px]">check_circle</span>
            <div className="flex flex-col">
              <span className="text-[13px] font-bold text-green-800">{appliedPromotion.promotion_code}</span>
              <span className="text-[11px] text-green-600">Đã áp dụng giảm giá</span>
            </div>
          </div>
          <button onClick={handleRemovePromotion} className="text-gray-400 p-1">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-center bg-[#f6f3f2] rounded-xl overflow-hidden p-1 pl-3 border border-transparent focus-within:border-[#8f0012]/30 transition-all">
            <span className="material-symbols-outlined text-gray-400 text-[20px] mr-2">sell</span>
            <input
              type="text"
              value={promoCode}
              onChange={handleInputChange}
              placeholder="Nhập mã ưu đãi"
              disabled={isLoading}
              className="flex-1 bg-transparent py-3 text-[14px] outline-none placeholder-gray-400"
            />
            <button
              type="submit"
              disabled={isLoading || !promoCode.trim()}
              className="bg-[#8f0012] text-white px-5 py-3 rounded-lg text-[10px] font-bold active:scale-95 transition-transform disabled:opacity-50"
            >
              {isLoading ? "..." : "Áp dụng"}
            </button>
          </div>
          {promotionError && (
            <p className="text-[#ba1a1a] text-[11px] mt-1 ml-3 font-medium">{promotionError}</p>
          )}
        </form>
      )}
    </div>
  );
};

export default PromoCodeForm;
