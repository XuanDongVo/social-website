import { api } from "../Api";

export const getAllUsersExceptSelf = async (userId) => {
    const response = await api.get(`/api/v1/users?id=${userId}`);
    return response;
}

export const getProfileUser = async (userId) => {
    const response = await api.get(`/api/v1/users/profile?id=${userId}`);
    return response;
}   