import { api } from '../Api';

export const registerUser = async ({ email, password, firstName, lastName }) => {
    const response = await api.post('/api/v1/auth/register', { email, password, firstName, lastName });
    return response;
};


export const loginUser = async ({ email, password }) => {
    const response = await api.post('/api/v1/auth/login', { email, password });
    return response;
}