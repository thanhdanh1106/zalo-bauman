import { instance } from "../axiosInstance";

// My Affiliate (User endpoints)
export async function getMyAffiliateInfo() {
    return await instance
        .get("/affiliate/my/affiliate")
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function enrollInAffiliateProgram(data: { affiliate_program_id: number; referrer_code?: string }) {
    return await instance
        .post("/affiliate/my/enroll", data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function getMyAffiliateStats() {
    return await instance
        .get("/affiliate/my/stats")
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function getMyAffiliateCommissions(params = {}) {
    const config = {
        params: params
    };
    return await instance
        .get("/affiliate/my/commissions", config)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function getMyAffiliatePoints(params = {}) {
    const config = {
        params: params
    };
    return await instance
        .get("/affiliate/my/points", config)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function getMyPointsBalance() {
    return await instance
        .get("/affiliate/my/points/balance")
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function checkReferralCode(code: string) {
    return await instance
        .get(`/affiliate/check/${code}`)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}