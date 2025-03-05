import { api } from "../Api";

export const getAllUsersExceptSelf = async (userId) => {
    const response = await api.get(`/api/v1/users?id=${userId}`);
    return response;
}

export const getProfileUser = async (userId) => {
    const response = await api.get(`/api/v1/users/profile?id=${userId}`);
    return response;
}

export const searchingUser = async (search) => {
    const response = await api.get(`/api/v1/users/search?search=${search}`);
    return response;
}
export const findUserById = async (userId) => {
    const response = await api.get(`/api/v1/users/${userId}`);
    return response;
}

export const upateProfile = async (data) => {
    const response = await api.post(`/api/v1/users/account/update`, data);
    return response;
}

export const changeprofileImage = async (urlIamge, userId) => {
    await api.patch(`/api/v1/users/account/picture?urlImage=${urlIamge}&id=${userId}`);
}
