import { instance } from "./axiosInstance";

export async function findManyProductAttributeValues(attributeId: number, params = {}) {
    const config = {
        params: params
    };
    return await instance
        .get("/product-attributes/" + attributeId + "/values", config)
        .then((res) => res.data)
        .catch(() => {
            return [];
        });
}

export async function findOneProductAttributeValue(attributeId: number, id: number) {
    return await instance
        .get(`/product-attributes/${attributeId}/values/${id}`)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function findOneProductAttributeValueByName(attributeId: number, name: string) {
    return await instance
        .get(`/product-attributes/${attributeId}/values/name/${name}`)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function createProductAttributeValue(attributeId: number, data: object) {
    return await instance
        .post("/product-attributes/" + attributeId + "/values", data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}

export async function updateProductAttributeValue(attributeId: number, id: number, data: object) {
    return await instance
        .put("/product-attributes/" + attributeId + "/values/" + id, data)
        .then((res) => res.data)
        .catch((err) => {
            return {
                error: true,
                ...err.response.data
            };
        });
}
export async function deleteProductAttributeValue(attributeId: number, id: number) {
    return await instance
        .delete("/product-attributes/" + attributeId + "/values/" + id)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}

export async function deleteProductAttributeValues(attributeId: number, ids: number[]) {
    const config = {
        data: {
            ids: ids
        }
    };
    return await instance
        .delete("/product-attributes/" + attributeId + "/values", config)
        .then((res) => {
            return res?.data;
        }).catch(function () {
            return null;
        });
}