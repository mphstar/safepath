import React, { useState } from "react";
import SidebarAdmin from "./SidebarAdmin";
import HeaderAdmin from "./HeaderAdmin";

const AdminLayout = ({
    children,
    sidebarActive = "",
    title = "",
    noPadding = false,
}) => {
    const [showSidebar, setShowSidebar] = useState(false);

    const handleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    return (
        <div className={`flex flex-row`}>
            <SidebarAdmin
                active={title}
                showSidebar={showSidebar}
                setShowSidebar={handleSidebar}
            />
            <div className="flex w-full flex-col md:pl-[200px] lg:pl-[300px] duration-300 ease-in-out min-h-[100dvh]">
                <HeaderAdmin title={title} setSidebar={handleSidebar} />
                <div
                    className={`${
                        noPadding ? "" : "px-4 md:px-8 py-4"
                    } flex flex-col flex-1 bg-light dark:bg-dark duration-300 ease-in-out`}
                >
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
