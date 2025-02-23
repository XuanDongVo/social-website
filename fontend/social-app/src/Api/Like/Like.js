import { api } from "../Api";

export const likePost = async (postId) => {
    const response = await api.get(`/api/v1/like/like-post?id=${postId}`);
    return response;
}