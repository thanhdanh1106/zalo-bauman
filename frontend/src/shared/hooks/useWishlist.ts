import { useToasterContext } from '@shared/components/ToasterContext';
import { RootState } from '@shared/store';
import {
    addToWishlist as addToWishlistAction,
    clearWishlist as clearWishlistAction,
    removeFromWishlist as removeFromWishlistAction,
    setWishlistItems,
    setWishlistLoading,
} from '@shared/store/slices/wishlistSlice';
import { productProps } from '@shared/types/product';
import { useDispatch, useSelector } from 'react-redux';

export const useWishlist = () => {
  const dispatch = useDispatch();
  const { showMessage } = useToasterContext();
  const { items, isLoading } = useSelector((state: RootState) => state.wishlist);

  const addToWishlist = async (product: productProps) => {
    try {
      dispatch(addToWishlistAction(product));
      showMessage('success', `${product.title} đã được thêm vào danh sách yêu thích!`);
      
      const isLogged = !!localStorage.getItem('li_at');
      if (isLogged) {
        const { toggleWishlist: toggleApi } = await import('@shared/utils/Account');
        await toggleApi(product.id);
      }
    } catch (error) {
      showMessage('error', 'Có lỗi xảy ra khi thêm vào danh sách yêu thích');
    }
  };

  const removeFromWishlist = async (productId: number) => {
    try {
      const product = items.find(item => item.id === productId);
      dispatch(removeFromWishlistAction(productId));
      
      if (product) {
        showMessage('success', `${product.title} đã được xóa khỏi danh sách yêu thích!`);
      }

      const isLogged = !!localStorage.getItem('li_at');
      if (isLogged) {
        const { toggleWishlist: toggleApi } = await import('@shared/utils/Account');
        await toggleApi(productId);
      }
    } catch (error) {
      showMessage('error', 'Có lỗi xảy ra khi xóa khỏi danh sách yêu thích');
    }
  };

  const toggleWishlist = async (product: productProps) => {
    const currentlyInWishlist = items.some(item => item.id === product.id);
    if (currentlyInWishlist) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product);
    }
  };

  const clearWishlist = () => {
    try {
      dispatch(clearWishlistAction());
      showMessage('success', 'Đã xóa toàn bộ danh sách yêu thích!');
    } catch (error) {
      showMessage('error', 'Có lỗi xảy ra khi xóa danh sách yêu thích');
    }
  };

  const isInWishlist = (productId: number): boolean => {
    return items.some(item => item.id === productId);
  };

  const getWishlistCount = (): number => {
    return items.length;
  };

  const setWishlist = (products: productProps[]) => {
    dispatch(setWishlistItems(products));
  };

  const setLoading = (loading: boolean) => {
    dispatch(setWishlistLoading(loading));
  };

  return {
    items,
    isLoading,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
    isInWishlist,
    getWishlistCount,
    setWishlist,
    setLoading,
  };
};