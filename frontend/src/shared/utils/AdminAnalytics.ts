import { instance } from "./axiosInstance";

export async function getOverview( params = {}) {
    const config = {
        params: params,
    };
    return await instance
        .get("/analytics", config)
        .then((res) => res.data)
        .catch(() => {
            return {
                error: true,
                data: [],
                message: ""
            };
        });
}

export async function getPaymentMontlyAnalytics(params = {}) {
    const config = {
        params: params,
    };

    return await instance
        .get("/analytics/payment/chart", config)
        .then((res) => res.data)
        .catch(() => {
            return {
                error: true,
                data: [],
                message: ""
            };
        });
}

export async function getPaymentMethodAnalytics(params = {}) {
    const config = {
        params: params,
    };

    return await instance
        .get("/analytics/payment/by-method", config)
        .then((res) => res.data)
        .catch(() => {
            return {
                error: true,
                data: [],
                message: ""
            };
        });
}