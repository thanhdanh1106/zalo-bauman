import { productProps } from '@shared/types/product';
import { useDispatch, useSelector } from 'react-redux';
import { useToasterContext } from '@shared/components/ToasterContext';
import { RootState } from '../store';
import {
  addItem,
  clearCart,
  clearError,
  decreaseQuantity,
  increaseQuantity,
  removeItem,
  syncCartWithStock,
  updateQuantity
} from '../store/slices/cartSlice';

export const useCart = () => {
  const dispatch = useDispatch();
  const { showMessage } = useToasterContext();
  const { items, total, subtotal, discount, loading, error } = useSelector((state: RootState) => state.cart);

  const addToCart = async (product: productProps, quantity: number = 1, selectedOption?: string) => {
    try {
      dispatch(addItem({ ...product, quantity, selected_option: selectedOption }));
      
      const isLogged = !!localStorage.getItem('li_at');
      if (isLogged) {
        const { addToCart: addToCartApi } = await import('@shared/utils/Cart');
        await addToCartApi(product.id, quantity);
      }

      setTimeout(() => {
        const currentError = (window as any).__store__?.getState()?.cart?.error;
        if (!currentError) {
          showMessage('success', `Đã thêm "${product.title}" vào giỏ hàng`);
        } else {
          showMessage('error', currentError);
          dispatch(clearError());
        }
      }, 100);
    } catch (err) {
      showMessage('error', 'Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng');
    }
  };

  const removeFromCart = async (productId: number) => {
    const item = items.find(item => item.id === productId);
    dispatch(removeItem(productId));

    const isLogged = !!localStorage.getItem('li_at');
    if (isLogged) {
      const { removeFromCart: removeFromCartApi } = await import('@shared/utils/Cart');
      await removeFromCartApi(productId);
    }

    if (item) {
      showMessage('success', `Đã xóa "${item.title}" khỏi giỏ hàng`);
    }
  };

  const updateItemQuantity = async (productId: number, quantity: number) => {
    dispatch(updateQuantity({ id: productId, quantity }));

    const isLogged = !!localStorage.getItem('li_at');
    if (isLogged) {
      const { updateCart: updateCartApi } = await import('@shared/utils/Cart');
      await updateCartApi(productId, quantity);
    }
    
    // Check for errors after update
    setTimeout(() => {
      const currentError = (window as any).__store__?.getState()?.cart?.error;
      if (currentError) {
        showMessage('error', currentError);
        dispatch(clearError());
      }
    }, 100);
  };

  const increaseItemQuantity = async (productId: number) => {
    dispatch(increaseQuantity(productId));
    
    const isLogged = !!localStorage.getItem('li_at');
    if (isLogged) {
      const item = items.find(i => i.id === productId);
      if (item) {
        const { updateCart: updateCartApi } = await import('@shared/utils/Cart');
        await updateCartApi(productId, item.quantity + 1);
      }
    }

    // Check for errors after increase
    setTimeout(() => {
      const currentError = (window as any).__store__?.getState()?.cart?.error;
      if (currentError) {
        showMessage('error', currentError);
        dispatch(clearError());
      }
    }, 100);
  };

  const decreaseItemQuantity = async (productId: number) => {
    const item = items.find(i => i.id === productId);
    dispatch(decreaseQuantity(productId));

    const isLogged = !!localStorage.getItem('li_at');
    if (isLogged && item) {
      const { updateCart: updateCartApi } = await import('@shared/utils/Cart');
      await updateCartApi(productId, item.quantity - 1);
    }
  };

  const clearAllItems = () => {
    dispatch(clearCart());
  };

  const getItemQuantity = (productId: number): number => {
    return items.find(item => item.id === productId)?.quantity || 0;
  };

  const isInCart = (productId: number): boolean => {
    return items.some(item => item.id === productId);
  };

  const getTotalItems = (): number => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getTotalPrice = (): number => {
    return total;
  };

  const getCartSummary = () => {
    const totalItems = getTotalItems();
    const totalPrice = getTotalPrice();
    
    return {
      totalItems,
      totalPrice,
      finalPrice: totalPrice,
    };
  };

  const syncWithStock = (products: productProps[]) => {
    dispatch(syncCartWithStock(products));
  };

  const validateCart = (): { isValid: boolean; issues: string[] } => {
    const issues: string[] = [];
    
    items.forEach(item => {
      if (!item.stock || item.stock <= 0) {
        issues.push(`${item.title} hiện đang hết hàng`);
      } else if (item.quantity > item.stock) {
        issues.push(`${item.title} chỉ còn ${item.stock} sản phẩm`);
      }
      
      if (item.status !== 'published') {
        issues.push(`${item.title} không còn khả dụng`);
      }
    });

    return {
      isValid: issues.length === 0,
      issues,
    };
  };

  return {
    // State
    items,
    total,
    subtotal,
    discount,
    loading,
    error,
    
    // Actions
    addToCart,
    removeFromCart,
    updateItemQuantity,
    increaseItemQuantity,
    decreaseItemQuantity,
    clearAllItems,
    syncWithStock,
    
    // Utilities
    getItemQuantity,
    isInCart,
    getTotalItems,
    getTotalPrice,
    getCartSummary,
    validateCart,
    
    // Error handling
    clearError: () => dispatch(clearError()),
  };
};

export default useCart;