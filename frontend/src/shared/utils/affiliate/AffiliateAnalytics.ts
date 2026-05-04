import { instance } from "../axiosInstance";

// Affiliate Analytics & Statistics
export async function getAffiliateStatistics(params = {}) {
    const config = {
        params: params
    };
    return await instance
        .get("/affiliate/statistics", config)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function getAffiliateOverview() {
    return await instance
        .get("/affiliate/overview")
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function getTopPerformers(params = {}) {
    const config = {
        params: params
    };
    return await instance
        .get("/affiliate/top-performers", config)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function getAffiliateRevenueChart(params = {}) {
    const config = {
        params: params
    };
    return await instance
        .get("/affiliate/revenue-chart", config)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function getRecentAffiliateActivities(params = {}) {
    const config = {
        params: params
    };
    return await instance
        .get("/affiliate/recent-activities", config)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}