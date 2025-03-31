import { apiClient } from "./config"


export const apiPostFeed = async(payload) => {
    return apiClient.post("/add-post", payload)
};

export const apiGetFeed = async(payload) => {
    return apiClient.get("/get-post", payload)
};

export const apiDeleteFeed = async(payload) => {
    return apiClient.delete("delete-post", payload)
};

export const apiPatchFeed = async(payload) => {
    return apiClient.patch("update-post", payload)
}