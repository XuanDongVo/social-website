import { api } from "../Api";

export const getPreviewSavedPost = async () => {
    const response = await api.get("/api/v1/saved-post/preview");
    return response;
}

export const savePost = async (postId) => {
    const response = await api.post(`/api/v1/saved-post/save?id=${postId}`);
    return response;
}

export const unSavePost = async (postId) => {
    const response = await api.delete(`/api/v1/saved-post/delete?id=${postId}`);
    return response;
}

export const getSavedPosts = async (page) => {
    const response = await api.get(`/api/v1/saved-post/all?page=${page}`);
    return response;
}