import { api } from "../Api";

export const addComment = async (comment) => {
    const response = await api.post("/api/v1/comments", comment);
    return response;
}

export const getComments = async (postId, page) => {
    const response = await api.get(`/api/v1/comments/post/${postId}?page=${page}`);
    return response;
}