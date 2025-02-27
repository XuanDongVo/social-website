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
    const [eventSource, setEventSource] = useState(null); // State để quản lý SSE
    const [notifications, setNotifications] = useState([]); // Lưu danh sách thông báo

    // Khi user thay đổi, lưu vào localStorage
    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    }, [user]);

    // Khởi tạo SSE khi user đăng nhập
    useEffect(() => {
        if (user?.id) {
            let retryCount = 0;
            const maxRetries = 3;

            const connectSSE = () => {
                const source = new EventSource(`http://localhost:8080/api/v1/notification/subscribe?id=${user.id}`);

                source.onopen = () => {
                    retryCount = 0;
                };

                source.onerror = (error) => {
                    source.close();
                    if (retryCount < maxRetries) {
                        retryCount++;
                        setTimeout(() => {
                            connectSSE(); // Thử kết nối lại
                        }, 2000);
                    } else {
                        setEventSource(null);
                        setNotifications([]); // Reset khi không kết nối được
                    }
                };

                // source.onmessage = (event) => {
                //     try {
                //         const data = JSON.parse(event.data);
                //         console.log("Thông báo mới (mặc định):", data);
                //     } catch (e) {
                //         console.error("Lỗi parse thông báo mặc định:", e, "Raw data:", event.data);
                //     }
                // };

                source.addEventListener("notification", (event) => {
                    try {
                        const notification = JSON.parse(event.data);
                        console.log("📩 Bạn có thông báo mới:", notification);
                        setNotifications((prev) => [notification, ...prev.slice(0, 49)]);
                    } catch (e) {
                        console.error("Lỗi parse JSON từ notification:", e, "Raw data:", event.data);
                    }
                });

                setEventSource(source);
                return source; // Trả về source để cleanup
            };

            const source = connectSSE();

            return () => {
                source.close();
                console.log("Kết nối SSE đã đóng!");
                setEventSource(null);
                setNotifications([]); // Reset thông báo
            };
        }
    }, [user?.id]);

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
        if (eventSource) {
            eventSource.close(); // Đóng kết nối SSE
            setEventSource(null);
        }
        setUser(null);
        setNotifications([]); // Xóa danh sách thông báo khi đăng xuất
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                login,
                register,
                logout,
                loading,
                error,
                setError,
                notifications,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;