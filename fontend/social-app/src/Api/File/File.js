import { api } from "../Api";

export const uploadFile = async ({ files }) => {
    const formData = new FormData();
    files.forEach((file) => {
        formData.append("files", file);
    });


    const response = await api.post('/api/v1/file/upload-file', formData, {
        headers: { 'content-type': 'multipart/form-data' }
    });

    return response;
};
