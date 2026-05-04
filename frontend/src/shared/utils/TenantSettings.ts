import { instance } from "./axiosInstance";

interface SettingParamsProps {
    settings: string[]
}

/* Common settings */
export async function getTenantSettings(params: SettingParamsProps) {
    const config = {
        params: params
    };
    return await instance
        .get("/tenants/settings", config)
        .then((res) => res.data)
        .catch(function (err) {
            return ({
                error: true,
                data: err
            });
        });
}

export async function updateTenantSettings(data: object) {
    return await instance
        .post("/tenants/settings", data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                data: err
            };
        });
}