import { instance } from "./axiosInstance";

export async function findManyRewards(params = {}) {
    const config = {
        params: params
    };
    return await instance
        .get("/rewards", config)
        .then((res) => res.data)
        .catch(() => {
            return {
                error: true,
                data: [],
                message: ""
            };
        });
}

export async function getUserPoints() {
    return await instance
        .get("/points")
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                data: { balance: 0, balance_int: 0 }
            };
        });
}

export async function getPointsHistory(params = {}) {
    const config = {
        params: params
    };
    return await instance
        .get("/points/history", config)
        .then((res) => res.data)
        .catch(() => {
            return {
                error: true,
                data: [],
                message: ""
            };
        });
}

export async function redeemReward(rewardId: number) {
    return await instance
        .post(`/rewards/${rewardId}/redeem`)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response?.data
            };
        });
}
export async function getUserRedemptions() {
    return await instance
        .get("/redemptions")
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                data: [],
                message: err.response?.data?.message || ""
            };
        });
}
