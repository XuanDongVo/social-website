import { api } from "../Api";

export const getAllChats = async (userId) => {
    const response = await api.get(`/api/v1/chats?sender-id=${userId}`);
    return response;
}

export const createChat = async (sender, receiver) => {
    const response = await api.post(`/api/v1/chats?sender-id=${sender}&receiver-id=${receiver}`);
    return response;
}

export const findById = async (id) => {
    const response = await api.get(`/api/v1/chats/get?chat-id=${id}`);
    return response;
}