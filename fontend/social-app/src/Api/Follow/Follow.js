import { api } from "../Api";

export const getFollowers = async () => {
    const response = await api.get("api/v1/follow/get-followers");
    return response;
}

export const getFollowing = async () => {
    const response = await api.get("api/v1/follow/get-following");
    return response;
}

export const isFollowing = async (userId) => {
    const response = await api.get(`api/v1/follow/check-follow?id=${userId}`);
    return response;
}

export const followUser = async (userId) => {
    const response = await api.post(`api/v1/follow/follow?id=${userId}`);
    return response;
}

export const deleteFollower = async (userId) => {
    const response = await api.delete(`api/v1/follow/delete-follower?id=${userId}`);
    return response;
}