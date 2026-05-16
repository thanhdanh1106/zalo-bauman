import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@shared/store';
import { getCart, syncCart as syncCartApi } from '@shared/utils/Cart';
import { findManyUserWishlist } from '@shared/utils/Account';
import { setCartItems } from '@shared/store/slices/cartSlice';
import { setWishlistItems } from '@shared/store/slices/wishlistSlice';

import api from "zmp-sdk";

const DataSync: React.FC = () => {
    const { getStartupParams } = api;
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.auth);
    const { items: cartItems } = useSelector((state: RootState) => state.cart);
    const prevUserRef = useRef(user);

    useEffect(() => {
        const captureRef = async () => {
            // 1. Try from URL query string
            const queryParams = new URLSearchParams(window.location.search);
            let ref = queryParams.get('ref');

            // 2. Try from Zalo Startup Params if URL doesn't have it
            if (!ref) {
                try {
                    const startupParams = await getStartupParams();
                    ref = (startupParams as any)?.ref || (startupParams as any)?.referrerId;
                } catch (e) {
                    console.warn("Error getting startup params (expected if in browser):", e);
                }
            }

            if (ref) {
                console.log("Captured referral ID:", ref);
                localStorage.setItem('affiliate_ref', ref.toString());
            }
        };

        captureRef();
    }, []);

    useEffect(() => {
        const syncData = async () => {
            // User just logged in
            if (!prevUserRef.current && user) {
                console.log("User logged in, syncing data...");
                
                // 1. Sync Cart
                if (cartItems.length > 0) {
                    const itemsToSync = cartItems.map(item => ({
                        id: item.id,
                        quantity: item.quantity,
                        selected_option: item.selected_option,
                        options: item.selected_option ? {
                            selected_option: item.selected_option,
                            title: item.title,
                            price: item.price,
                            image: item.thumbnail?.original_url || (item as any).image,
                            sku: (item as any).sku
                        } : null
                    }));
                    const syncResponse = await syncCartApi(itemsToSync);
                    if (!syncResponse.error) {
                        dispatch(setCartItems(syncResponse.data));
                    }
                } else {
                    // Just fetch cart if local is empty
                    const cartResponse = await getCart();
                    if (!cartResponse.error) {
                        dispatch(setCartItems(cartResponse.data));
                    }
                }

                // 2. Sync Wishlist
                const wishlistResponse = await findManyUserWishlist();
                if (!wishlistResponse.error) {
                    dispatch(setWishlistItems(wishlistResponse.data));
                }
            }
            
            // Update ref
            prevUserRef.current = user;
        };

        syncData();
    }, [user, dispatch]);

    // This component doesn't render anything
    return null;
};

export default DataSync;
