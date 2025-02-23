import { api } from "../Api";

export const getFollowers = async (userId) => {

}

export const getFollowing = async (userId) => {

}

export const isFollowing = async (userId) => {
    const response = await api.get(`api/v1/follow/check-follow?id=${userId}`);
    return response;
}

export const followUser = async (userId) => {
    const response = await api.post(`api/v1/follow/follow?id=${userId}`);
    return response;
}