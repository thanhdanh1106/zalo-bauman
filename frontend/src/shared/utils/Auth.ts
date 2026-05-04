import { instance } from "./axiosInstance";

export async function userLoginWithZalo(data) {
    return await instance
        .post("/auth/zalo-login", data)
        .then((res) => res.data)
        .catch((err) => {
            console.error("Zalo login error:", err);
            return { error: true, message: "Lỗi kết nối máy chủ" };
        });
}

export async function userLoginByToken(data) {
    const response = await instance
        .post("/auth/login/token", data)
        .then((res) => res.data)
        .catch(() => {
            return [];
        });

    return response;
}

export async function loginWithFaceBook(data: object) {
    const response = await instance
        .post("/auth/social/login/facebook", data)
        .then((res) => res.data)
        .catch((error) => {
            console.log("error", error);
            return [];
        });

    return response;
}

export async function loginWithOneTap(data: object) {
    const response = await instance
        .post("/auth/social/login/onetap", data)
        .then((res) => res.data)
        .catch((error) => {
            console.log("error", error);
            return [];
        });

    return response;
}

export async function loginWithGoogle(data: object) {
    const response = await instance
        .post("/auth/social/login/google", data)
        .then((res) => res.data)
        .catch((error) => {
            console.log("error", error);
            return [];
        });

    return response;
}

export async function socialLogin(data: object) {
    const response = await instance
        .post("/auth/social/login", data)
        .then((res) => res.data)
        .catch((error) => {
            console.log("error", error);
            return [];
        });

    return response;
}

export async function userLogin(data: object) {
    const response = await instance
        .post("/auth/login", data)
        .then((res) => res.data)
        .catch((error) => {
            console.log("error", error);
            return [];
        });

    return response;
}

export async function sentPasswordReset(data: object) {
    const response = await instance
        .post("/auth/reset-password", data)
        .then((res) => res.data)
        .catch(() => {
            return [];
        });

    return response;
}

export async function changeUserPassword(data: object) {
    const response = await instance
        .post("/auth/change-password", data)
        .then((res) => res.data)
        .catch(() => {
            return [];
        });

    return response;
}

export async function userRegister(data: object) {
    const response = await instance
        .post("/auth/register", data)
        .then((res) => res.data)
        .catch(() => {
            return [];
        });

    return response;
}

export async function getUserLoggedIn() {
        const response = await instance
        .get("/auth/me")
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });

    return response;
}

export async function updateUserLoggedin(data: object) {
        const response = await instance
        .post("/auth/me", data)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });

    return response;
}


export async function userLogout() {
    const response = await instance
        .post("/auth/logout", {})
        .then((res) => res.data)
        .catch(() => {
            return [];
        });

    return response;
}