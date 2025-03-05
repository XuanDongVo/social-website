import { api } from "../Api";

export const likePost = async (postId) => {
    const response = await api.get(`/api/v1/like/like-post/toggle?id=${postId}`);
    return response;
}

export const getListLikePost = async (postId) => {
    const response = await api.get(`/api/v1/like/like-post/list?id=${postId}`);
    return response;
}