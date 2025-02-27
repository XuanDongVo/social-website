import { api } from "../Api";

export const getPreviewCollections = async () => {
    const response = api.get("/api/v1/collection/preview");
    return response;
}

export const getAllSavedPostInCollectionById = async (collectionId, page) => {
    const response = api.get(`/api/v1/collection/${collectionId}?page=${page}`);
    return response;
}

export const deleteSavedPostInCollection = async (postId, collectionId) => {
    const response = api.delete(`/api/v1/collection/delete/saved-post?collectionId=${collectionId}&&postId=${postId}`);
    return response;
}

export const addSavedPostInCollection = async (collectionId, postIds) => {
    const response = api.post("/api/v1/collection/add/saved-post", { collectionId, postIds })
    return response;
}

export const deleteCollection = async (collectionId) => {
    const response = api.delete(`/api/v1/collection/${collectionId}`)
    return response;
}

export const modifyNameCollection = async (collectionId, collectionName) => {
    const response = api.put(`/api/v1/collection/modify/name?collectionId=${collectionId}&collectionName=${collectionName}`)
    return response;
}
export const createNewCollection = async (name, postIds) => {
    const response = api.post("/api/v1/collection/create", { name, postIds });
    return response;
}