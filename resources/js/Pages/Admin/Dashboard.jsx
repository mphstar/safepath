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
    const { laporan } = usePage().props;

    const jemberBounds = [
        [-8.552872005387782, 113.85786358974842], // Titik barat daya
        [-7.946045199345399, 113.34974591471762], // Titik timur laut
    ];


    return (
        <AdminLayout title="Dashboard" noPadding>
            <div className="w-full h-full relative">
                <MapContainer
                    className="w-[100%] h-[100%] z-10"
                    center={[-8.17458474693488, 113.70135789730354]}
                    zoom={13}
                    maxZoom={16}
                    maxBounds={jemberBounds}
                    scrollWheelZoom={true}
                    zoomControl={false}
                >
                    <ZoomControl position="topright" />
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {laporan &&
                        laporan.map((item, i) => {
                            const lat = item.lokasi.split(",")[0];
                            const long = item.lokasi.split(",")[1];

                            return (
                                <Marker key={i} position={[lat, long]}>
                                    <Popup>
                                        <h1 className="font-semibold text-sm">
                                            {item.detail_kategori.kategori.nama}
                                        </h1>
                                        <p className="text-xs">
                                            {item.detail_kategori.nama}
                                        </p>
                                    </Popup>
                                </Marker>
                            );
                        })}
                </MapContainer>
                <OverlayChart />
            </div>
        </AdminLayout>
    );
};

const OverlayChart = () => {
    const { statistik, report, kategori } = usePage().props;

    const pieOptions = {
        series: kategori.map((item) => item.laporan_count),
        options: {
            chart: {
                width: 380,
                type: "pie",
            },
            labels: kategori.map((item) => item.nama),
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

    const chartBarOptions = {
        // Define your chart options here
        chart: {
            type: "bar",
            toolbar: {
                show: false,
            },
        },
        plotOptions: {
            bar: {
                horizontal: true,
            },
        },

        series: [
            {
                name: "Kejahatan",
                data: report.kejahatan.map((item) => item.total).reverse(),
            },
            {
                name: "Kecelakaan",
                data: report.kecelakaan.map((item) => item.total).reverse(),
            },
        ],

        xaxis: {
            labels: {
                show: true,
                rotate: -45,
                trim: true,
                minHeight: 22,
            },
            tooltip: {
                enabled: false,
            },
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
            categories: report.kejahatan
                .map((item) => item.kecamatan)
                .reverse(),
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
                            options={chartBarOptions}
                            series={chartBarOptions.series}
                            type="bar"
                            height={"100%"}
                        />
                    </div>
                </div>
                <div className="bg-white border-2 h-[300px] rounded-md pointer-events-auto flex flex-col px-3 py-2">
                    <h1 className="font-semibold">Crime & Accident</h1>
                    <div className="w-full h-full py-3 ">
                        <ReactApexChart
                            options={pieOptions.options}
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
