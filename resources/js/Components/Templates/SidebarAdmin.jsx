import { Link } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import { FaBuilding, FaHome, FaUser } from "react-icons/fa";
import { FaBookOpenReader, FaChartColumn } from "react-icons/fa6";
import { IoBookOutline, IoLocationOutline } from "react-icons/io5";
import { LuBuilding } from "react-icons/lu";
import { MdHistory, MdOutlineCategory } from "react-icons/md";
import { RiNewsLine } from "react-icons/ri";
import { TbBuildingCommunity, TbReportSearch } from "react-icons/tb";

const SidebarAdmin = ({ showSidebar, setShowSidebar, active = "" }) => {
    const [collapseInventory, setCollapseInventory] = useState(false);
    const [collapseActivity, setCollapseActivity] = useState(false);

    useEffect(() => {
        if (
            active == "admin.item" ||
            active == "admin.select.room" ||
            active == "admin.room"
        ) {
            setCollapseInventory(true);
        }

        if (active == "admin.checkout" || active == "admin.retur") {
            setCollapseActivity(true);
        }

        return () => {
            setCollapseInventory(false);
            setCollapseActivity(false);
        };
    }, []);

    return (
        <>
            <div
                className={`h-[100dvh] z-[99] bg-white flex max-w-[90%] md:min-w-0 w-[400px] md:w-[200px] lg:w-[300px] fixed ${
                    showSidebar ? "translate-x-0" : "-translate-x-[100%]"
                } md:translate-x-0 text-[20px] overflow-y-auto duration-300 max-w-[90%] ease-in-out flex-col px-[34px] py-[22px] custom-scrollbar-sidebar border-r-2`}
            >
                <div className="flex mb-[18px] flex-row gap-4 items-center mt-6">
                    <span className="font-semibold text-[16px] md:text-base flex items-center gap-3">
                        <div className="w-10">
                            <img src="/assets/images/logo.png" alt="Logo" />
                        </div>
                        <div className="text-black border-l-2 border-primary pl-2 text-[20px] md:text-base flex-1">
                            <span className="text-primary">Safe</span>Path
                        </div>
                    </span>
                </div>
                {/* <div className="h-[71px]"></div> */}
                <p className="text-gray-400 text-sm py-4">Menu</p>
                <SidebarItem
                    title="Dashboard"
                    icon={<FaHome />}
                    active={active == "Dashboard"}
                    href="/admin"
                />

                <p className="text-gray-400 text-sm py-2 mt-6">Master Data</p>
                <SidebarItem
                    title="User"
                    icon={<FaUser />}
                    active={active == "User"}
                    href="/admin/user"
                />
                <SidebarItem
                    title="Kecamatan"
                    icon={<TbBuildingCommunity />}
                    active={active == "Kecamatan"}
                    href="/"
                />
                <SidebarItem
                    title="Category"
                    icon={<LuBuilding />}
                    active={active == "Category"}
                    href="/"
                />
                <SidebarItem
                    title="Location"
                    icon={<IoLocationOutline />}
                    active={active == "Location"}
                    href="/"
                />

                <p className="text-gray-400 text-sm py-2 mt-6">Services</p>
                <SidebarItem
                    title="Confirm Report"
                    icon={<TbReportSearch />}
                    active={active == "Confirm Report"}
                    href="/"
                />
                <SidebarItem
                    title="News"
                    icon={<RiNewsLine />}
                    active={active == "News"}
                    href="/"
                />

                <p className="text-gray-400 text-sm py-2 mt-6">Report</p>
                <SidebarItem
                    title="Grafik"
                    icon={<FaChartColumn />}
                    active={active == "Grafik"}
                    href="/"
                />
                <SidebarItem
                    title="History Report"
                    icon={<MdHistory />}
                    active={active == "History Report"}
                    href="/"
                />
            </div>
            <div
                onClick={setShowSidebar}
                className={`duration-500 ease-in-out min-h-[100dvh] w-screen flex z-[90] ${
                    showSidebar
                        ? "bg-black/50 backdrop-blur-sm pointer-events-auto"
                        : "bg-black/0 backdrop-blur-none pointer-events-none"
                } fixed`}
            ></div>
        </>
    );
};

const SidebarItem = ({ title, icon, active, href }) => {
    return (
        <Link href={href}>
            <div
                className={`flex w-full items-center gap-4 py-4 md:py-2 ${
                    active ? "text-primary" : "text-colorText"
                }`}
            >
                {icon}
                <span className={`text-[16px] `}>{title}</span>
            </div>
        </Link>
    );
};

export default SidebarAdmin;
