import { instance } from "./axiosInstance";

interface SettingParamsProps {
    settings: string[]
}

/* Common settings */
export async function getSettings(params: SettingParamsProps) {
    const config = {
        params: params
    };
    return await instance
        .get("/settings", config)
        .then((res) => res.data)
        .catch(function (err) {
            return ({
                error: true,
                data: err
            });
        });
}

export async function updateSettings(data: object) {
    return await instance
        .post("/settings", data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                data: err
            };
        });
}


/* Page settings */
export async function getPageSetting(params: { template: string }) {
    return await instance
        .get(`/settings/pages/${params.template}`)
        .then((res) => res.data)
        .catch(function (err) {
            return ({
                error: true,
                data: err
            });
        });
}

export async function getPageSettings(params: { templates: string[] }) {
    const config = {
        params: params
    };
    return await instance
        .get("/settings/pages", config)
        .then((res) => res.data)
        .catch(function (err) {
            return ({
                error: true,
                data: err
            });
        });
}

export async function updatePageSettings(data: Record<string, number>) {
    return await instance
        .post("/settings/pages", data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                data: err
            };
        });
}