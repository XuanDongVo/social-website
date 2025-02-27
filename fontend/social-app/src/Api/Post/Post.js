import { api } from "../Api";

export const createPost = async ({ caption, images }) => {
    const response = await api.post('/api/v1/post/upload', { caption, images });
    return response;
}

export const getSelfPosts = async ({ userId, page }) => {
    const response = await api.get(`/api/v1/post/self-post?id=${userId}&page=${page}`);
    return response;
}

export const getNewsFeed = async ({ page }) => {
    const response = await api.get(`/api/v1/post/news-feed?page=${page}`);
    return response;
}

export const deletePost = async (postId) => {
    const response = await api.delete(`/api/v1/post/delete?id=${postId}`);
    return response;
}

export const getPostById = async (postId) => {
    const response = await api.get(`/api/v1/post?id=${postId}`);
    return response;
}