import { api } from "../Api";

export const getNotificationOfUser = () => {
    const respone = api.get("/api/v1/notification");
    return respone;
}

export const markAsRead = () => {
    const respone = api.patch("/api/v1/notification/read");
    return respone;
}