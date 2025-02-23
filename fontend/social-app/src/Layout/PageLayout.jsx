import React, { useContext } from "react";
import { AuthContext } from "../Contexts/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "../Component/SideBar/Sidebar";

const PageLayout = () => {
    const { user } = useContext(AuthContext);

    if (!user) {
        return <Navigate to="/auth" replace />;
    }

    return (
        <div className="d-flex">
            <Sidebar />
            <div className="flex-grow-1 p-3">
                <Outlet />
            </div>
        </div>
    );
}

export default PageLayout;
