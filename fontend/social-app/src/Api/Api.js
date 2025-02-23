import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate nếu bạn đang sử dụng React Router

export const baseUrl = 'http://localhost:8080';

export const api = axios.create({
    baseURL: baseUrl,
    withCredentials: true, // Đảm bảo gửi cookie với mỗi yêu cầu
});

// Thêm interceptor để gửi token vào header
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.log(error);
        return Promise.reject(error);
    }
);