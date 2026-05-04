import CryptoJS from "crypto-js";
import { Payment } from "zmp-sdk/apis";

export interface ZaloOrderItem {
  id: string;
  amount: number;
}

export interface ZaloOrderData {
  amount: number;
  item: ZaloOrderItem[];
  desc: string;
  extradata?: any;
  method?: {
    id: string;
    isCustom: boolean;
  };
}

export interface ZaloOrderResponse {
  orderId: string;
  messageToken?: string;
}

/**
 * Tạo MAC (Message Authentication Code) cho Zalo Payment
 * @param data - Dữ liệu cần tạo MAC
 * @param privateKey - Private key được cung cấp bởi Zalo
 * @returns MAC string
 */
export const createMAC = (data: any, privateKey: string): string => {
  try {
    // Chuyển đổi dữ liệu theo yêu cầu của Zalo
    const params = {
      ...data,
      extradata: typeof data.extradata === 'object' ? JSON.stringify(data.extradata) : data.extradata,
      method: typeof data.method === 'object' ? JSON.stringify(data.method) : data.method,
      item: typeof data.item === 'object' ? JSON.stringify(data.item) : data.item,
    };

    // Sắp xếp các key theo thứ tự từ điển tăng dần
    const dataMac = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');

    // Tạo MAC bằng HMAC-SHA256
    const mac = CryptoJS.HmacSHA256(dataMac, privateKey).toString();
    return mac;
  } catch (error) {
    console.error('Error creating MAC:', error);
    throw new Error('Không thể tạo MAC');
  }
};

/**
 * Tạo đơn hàng Zalo Payment
 * @param orderData - Thông tin đơn hàng
 * @returns Promise<ZaloOrderResponse>
 */
export const createZaloOrder = async (orderData: ZaloOrderData): Promise<ZaloOrderResponse> => {
  try {
    // Lấy private key từ environment variables
    const privateKey = import.meta.env.VITE_ZALO_PAYMENT_PRIVATE_KEY;
    
    if (!privateKey) {
      throw new Error('Zalo Payment private key không được cấu hình');
    }

    // Chuẩn bị dữ liệu cho Zalo
    const zaloData = {
      amount: orderData.amount,
      desc: orderData.desc,
      item: orderData.item,
      extradata: orderData.extradata ? JSON.stringify(orderData.extradata) : undefined,
      method: orderData.method ? JSON.stringify(orderData.method) : undefined,
    };

    // Loại bỏ các trường undefined
    Object.keys(zaloData).forEach(key => {
      if (zaloData[key] === undefined) {
        delete zaloData[key];
      }
    });

    // Tạo MAC
    const mac = createMAC(zaloData, privateKey);

    // Gọi API Zalo Payment
    const response = await new Promise<ZaloOrderResponse>((resolve, reject) => {
      Payment.createOrder({
        ...zaloData,
        mac,
        success: (data) => {
          console.log('Zalo order created successfully:', data);
          resolve({
            orderId: data.orderId,
            messageToken: data.messageToken
          });
        },
        fail: (error) => {
          console.error('Zalo order creation failed:', error);
          reject(new Error(`Tạo đơn hàng Zalo thất bại: ${error.message || 'Unknown error'}`));
        },
      });
    });

    return response;
  } catch (error) {
    console.error('Error in createZaloOrder:', error);
    throw error;
  }
};

/**
 * Tạo đơn hàng Zalo với phương thức thanh toán cụ thể
 * @param orderData - Thông tin đơn hàng
 * @param paymentMethodId - ID phương thức thanh toán
 * @returns Promise<ZaloOrderResponse>
 */
export const createZaloOrderWithSpecificMethod = async (
  orderData: ZaloOrderData,
  paymentMethodId: string
): Promise<ZaloOrderResponse> => {
  const dataWithMethod = {
    ...orderData,
    method: {
      id: paymentMethodId,
      isCustom: false, // false: Phương thức thanh toán của Platform
    },
  };

  return createZaloOrder(dataWithMethod);
};

/**
 * Chuyển đổi dữ liệu giỏ hàng thành format Zalo
 * @param cartItems - Danh sách sản phẩm trong giỏ hàng
 * @param totalAmount - Tổng số tiền
 * @param description - Mô tả đơn hàng
 * @param extraData - Dữ liệu bổ sung
 * @returns ZaloOrderData
 */
export const transformCartToZaloOrder = (
  cartItems: any[],
  totalAmount: number,
  description: string,
  extraData?: any
): ZaloOrderData => {
  const zaloItems: ZaloOrderItem[] = cartItems.map((item, index) => ({
    id: item.id?.toString() || index.toString(),
    amount: Math.round(item.price * item.quantity),
  }));

  return {
    amount: Math.round(totalAmount),
    item: zaloItems,
    desc: description,
    extradata: extraData,
  };
};

/**
 * Các phương thức thanh toán Zalo hỗ trợ
 */
export const ZALO_PAYMENT_METHODS = {
  VNPAY: 'VNPAY',
  VNPAY_SANDBOX: 'VNPAY_SANDBOX',
  COD: 'COD',
  COD_SANDBOX: 'COD_SANDBOX',
  BANK: 'BANK',
  BANK_SANDBOX: 'BANK_SANDBOX',
} as const;

export type ZaloPaymentMethod = typeof ZALO_PAYMENT_METHODS[keyof typeof ZALO_PAYMENT_METHODS];