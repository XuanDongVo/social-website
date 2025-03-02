import { api } from "../Api";

export const getMessagesByChatId = async (chatId) => {
    const response = await api.get(`/api/v1/messages/chat/${chatId}`);
    return response;
}

export const setMessageToSeen = async (chatId) => {
    await api.patch(`/api/v1/messages?chat-id=${chatId}`);
}