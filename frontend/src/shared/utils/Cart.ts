import { instance } from "./axiosInstance";

export const getCart = async () => {
    return await instance
        .get("/cart")
        .then((res) => res.data)
        .catch((err) => ({ error: true, ...err.response?.data }));
};

export const addToCart = async (productId: number, quantity: number = 1, selectedOption?: string, optionsData?: any) => {
    return await instance
        .post("/cart", { product_id: productId, quantity, selected_option: selectedOption, options: optionsData })
        .then((res) => res.data)
        .catch((err) => ({ error: true, ...err.response?.data }));
};

export const updateCart = async (productId: number, quantity: number, selectedOption?: string) => {
    return await instance
        .patch("/cart", { product_id: productId, quantity, selected_option: selectedOption })
        .then((res) => res.data)
        .catch((err) => ({ error: true, ...err.response?.data }));
};

export const removeFromCart = async (productId: number, selectedOption?: string) => {
    return await instance
        .delete("/cart", { data: { product_id: productId, selected_option: selectedOption } })
        .then((res) => res.data)
        .catch((err) => ({ error: true, ...err.response?.data }));
};

export const syncCart = async (items: any[]) => {
    return await instance
        .post("/cart/sync", { items })
        .then((res) => res.data)
        .catch((err) => ({ error: true, ...err.response?.data }));
};
