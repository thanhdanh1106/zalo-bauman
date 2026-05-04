
import { instance } from "./axiosInstance";

/* Another functionality to fetch user orders, wishlist, etc. */
export const findManyUserOrders = async (params = {}) => {
    const config = {
        params: params
    };
    return await instance
        .get("/account/orders", config)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export const findManyUserWishlist = async (params = {}) => {
    const config = {
        params: params
    };
    return await instance
        .get("/account/wishlist", config)
        .then((res) => res.data)            
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export const createUserWishlist = async (data: object) => { 
    return await instance   
        .post("/account/wishlist", data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export const deleteUserWishlist = async (id: number) => {
    return await instance
        .delete("/account/wishlist/" + id)            
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
} 

export const toggleWishlist = async (productId: number) => {
    return await instance
        .post("/account/wishlist", { product_id: productId })
        .then((res) => res.data)
        .catch((err) => ({ error: true, ...err.response?.data }));
}


export const getAffiliateInfo = async () => {   
    return await instance   
        .get("/account/affiliate")            
        .then((res) => res.data)    
        .catch((err) => {
            return {
                error: true,
                ...err.response.data            
            };
        });
}

export const getAffiliateCommissions = async (params = {}) => {
    const config = {
        params: params
    };
    return await instance
        .get("/account/affiliate/commissions", config)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export const getAffiliateReferrals = async (params = {}) => {
    const config = {
        params: params
    };
    return await instance
        .get("/account/affiliate/referrals", config)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export const applyAffiliate = async (params = {}) => {
    const config = {
        params: params
    };
    return await instance
        .post("/account/affiliate/apply", config)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export const getAddresses = async () => {
    return await instance
        .get("/account/addresses")
        .then((res) => res.data)
        .catch((err) => ({ error: true, ...err.response?.data }));
};

export const createAddress = async (data: object) => {
    return await instance
        .post("/account/addresses", data)
        .then((res) => res.data)
        .catch((err) => ({ error: true, ...err.response?.data }));
};

export const updateAddress = async (id: number, data: object) => {
    return await instance
        .patch(`/account/addresses/${id}`, data)
        .then((res) => res.data)
        .catch((err) => ({ error: true, ...err.response?.data }));
};

export const deleteAddress = async (id: number) => {
    return await instance
        .delete(`/account/addresses/${id}`)
        .then((res) => res.data)
        .catch((err) => ({ error: true, ...err.response?.data }));
};
