import React from "react";
import AdminLayout from "../../Components/Templates/AdminLayout";
import {
    MapContainer,
    Marker,
    Popup,
    TileLayer,
    ZoomControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import ReactApexChart from "react-apexcharts";
import { usePage } from "@inertiajs/react";

const Dashboard = () => {
    return (
        <AdminLayout title="Dashboard" noPadding>
            <div className="w-full h-full relative">
                <MapContainer
                    className="w-[100%] h-[100%] z-10"
                    center={[-8.17458474693488, 113.70135789730354]}
                    zoom={13}
                    scrollWheelZoom={true}
                    zoomControl={false}
                >
                    <ZoomControl position="topright" />
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[51.505, -0.09]}>
                        <Popup>
                            A pretty CSS3 popup. <br /> Easily customizable.
                        </Popup>
                    </Marker>
                </MapContainer>
                <OverlayChart />
            </div>
        </AdminLayout>
    );
};

const OverlayChart = () => {
    const { statistik } = usePage().props;

    const pieOptions = {
        series: [44, 55, 13, 43, 22],
        options: {
            chart: {
                width: 380,
                type: "pie",
            },
            labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200,
                        },
                        legend: {
                            position: "bottom",
                        },
                    },
                },
            ],
        },
    };

    const chartOptions = {
        // Define your chart options here
        chart: {
            type: "line",
            toolbar: {
                show: false,
            },
        },

        series: [
            {
                name: "Kejahatan",
                data: statistik.kejahatan.map((item) => item.total).reverse(),
            },
            {
                name: "Kecelakaan",
                data: statistik.kecelakaan.map((item) => item.total).reverse(),
            },
        ],
        xaxis: {
            categories: statistik.kejahatan.map((item) => item.bulan).reverse(),
        },
    };

    return (
        <div className="flex flex-col absolute top-0 left-0 w-full h-full z-20 pointer-events-none  justify-between px-4 py-3">
            <div className="flex flex-row gap-3 pointer-events-auto w-fit">
                <div className="bg-white rounded-md border-2 pr-3">
                    <select className="outline-none bg-transparent px-3 py-2">
                        <option name="">Jan</option>
                        <option name="">Feb</option>
                        <option name="">Mar</option>
                        <option name="">Apr</option>
                    </select>
                </div>
                <div className="bg-white rounded-md border-2 pr-3">
                    <select className="outline-none bg-transparent px-3 py-2">
                        <option name="">2020</option>
                        <option name="">2021</option>
                        <option name="">2022</option>
                        <option name="">2023</option>
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-white border-2 h-[300px] rounded-md pointer-events-auto flex flex-col px-3 py-2">
                    <h1 className="font-semibold">Statistics</h1>
                    <div className="w-full h-full">
                        <ReactApexChart
                            options={chartOptions}
                            series={chartOptions.series}
                            type="line"
                            height={"100%"}
                        />
                    </div>
                </div>
                <div className="bg-white border-2 h-[300px] rounded-md pointer-events-auto flex flex-col px-3 py-2">
                    <h1 className="font-semibold">Report</h1>
                    <div className="w-full h-full">
                        <ReactApexChart
                            options={chartOptions}
                            series={chartOptions.series}
                            type="bar"
                            height={"100%"}
                        />
                    </div>
                </div>
                <div className="bg-white border-2 h-[300px] rounded-md pointer-events-auto flex flex-col px-3 py-2">
                    <h1 className="font-semibold">Crime & Accident</h1>
                    <div className="w-full h-full py-3 ">
                        <ReactApexChart
                            options={pieOptions}
                            series={pieOptions.series}
                            type="pie"
                            height={"100%"}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
