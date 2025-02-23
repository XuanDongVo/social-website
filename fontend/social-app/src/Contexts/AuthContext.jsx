import React, { createContext, useState, useEffect } from "react";
import { loginUser, registerUser } from "../Api/Authentication/Authenticate";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        // Lấy user từ localStorage nếu có
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Khi user thay đổi, lưu vào localStorage
    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    }, [user]);

    const login = async ({ email, password }) => {
        setLoading(true);
        setError(null);
        try {
            const response = await loginUser({ email, password });
            setUser(response.data);
            localStorage.setItem("accessToken", response.data.accessToken);
            return response;
        } catch (err) {
            setError(err.response?.data || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    const register = async ({ email, password, firstName, lastName }) => {
        setLoading(true);
        setError(null);
        try {
            const response = await registerUser({ email, password, firstName, lastName });
            setUser(response.data);
            return response;
        } catch (err) {
            setError(err.response?.data || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, register, logout, loading, error, setError }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
