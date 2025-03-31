import { apiClient } from "./config";

export const apiSignUp = async(payload) => {
 return apiClient.post("signup", payload)
};

export const apiLogIn = async(payload) => {
return apiClient.post('login', payload)
};




