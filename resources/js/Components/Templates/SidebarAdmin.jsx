import { Head, Link } from "@inertiajs/react";
import React, { act, useEffect, useState } from "react";
import { FaBuilding, FaHome, FaUser } from "react-icons/fa";
import { FaBookOpenReader, FaChartColumn } from "react-icons/fa6";
import { LuBuilding } from "react-icons/lu";

import { BiCctv } from "react-icons/bi";
import { MdHistory } from "react-icons/md";
import { RiNewsLine } from "react-icons/ri";
import { TbBuildingCommunity, TbReportSearch } from "react-icons/tb";

const SidebarAdmin = ({ showSidebar, setShowSidebar, active = "" }) => {
    return (
        <>
            <Head title={active} />
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
                    title="Polsek"
                    icon={<TbBuildingCommunity />}
                    active={active == "Polsek"}
                    href="/admin/polsek"
                />
                <SidebarItem
                    title="Kategori"
                    icon={<LuBuilding />}
                    active={active == "Kejahatan" || active == "Kecelakaan"}
                    href="/admin/kategori/kejahatan"
                />

                <SidebarItem
                    title="CCTV"
                    icon={<BiCctv />}
                    active={active == "CCTV"}
                    href="/admin/cctv"
                />

                <p className="text-gray-400 text-sm py-2 mt-6">Services</p>
                <SidebarItem
                    title="Confirm Report"
                    icon={<TbReportSearch />}
                    active={active == "Confirm Report"}
                    href="/admin/confirm-report"
                />
                <SidebarItem
                    title="Berita"
                    icon={<RiNewsLine />}
                    active={active == "Berita"}
                    href="/admin/berita"
                />

                <p className="text-gray-400 text-sm py-2 mt-6">Report</p>
                <SidebarItem
                    title="Grafik"
                    icon={<FaChartColumn />}
                    active={active == "Grafik"}
                    href="/admin/grafik"
                />
                <SidebarItem
                    title="History Report"
                    icon={<MdHistory />}
                    active={active == "History"}
                    href="/admin/history"
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
