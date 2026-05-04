import { instance } from "./axiosInstance";

export async function findManyBanners(params = {}) {
    const config = {
        params: params
    };
    return await instance
        .get("/banners", config)
        .then((res) => res.data)
        .catch((err) => {
            console.error("Error in findManyBanners:", err);
            return [];
        });
}
