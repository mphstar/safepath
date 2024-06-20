import React, { useEffect } from "react";
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
import { FaCar } from "react-icons/fa";
import { MdOutlineFilterAlt } from "react-icons/md";
import CustomModal from "../../Components/Molecules/CustomModal";
import useDashboard from "../../Stores/useDashboard";

const Dashboard = () => {
    const { laporan } = usePage().props;

    const jemberBounds = [
        [-8.552872005387782, 113.85786358974842], // Titik barat daya
        [-7.946045199345399, 113.34974591471762], // Titik timur laut
    ];

    const iconCrime = new L.Icon({
        iconUrl: "/assets/images/marker_kejahatan.png",
        iconRetinaUrl: "/assets/images/marker_kejahatan.png",
        iconSize: new L.Point(60, 60),
    });
    const iconKelakaan = new L.Icon({
        iconUrl: "/assets/images/marker_kecelakaan.png",
        iconRetinaUrl: "/assets/images/marker_kecelakaan.png",
        iconSize: new L.Point(60, 60),
    });

    const store = useDashboard();

    return (
        <AdminLayout title="Dashboard" noPadding>
            <ModalFilter />
            <div className="w-full h-full relative">
                <MapContainer
                    className="w-[100%] h-[100%] z-10"
                    center={[-8.17458474693488, 113.70135789730354]}
                    zoom={13}
                    minZoom={12}
                    maxZoom={16}
                    // maxBounds={jemberBounds}
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

                            if (
                                !store.kategoriSelected.includes(
                                    item.detail_kategori.nama
                                )
                            )
                                return null;

                            return (
                                <Marker
                                    icon={
                                        item.detail_kategori.kategori.id == 1
                                            ? iconCrime
                                            : iconKelakaan
                                    }
                                    key={i}
                                    position={[lat, long]}
                                >
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

const ModalFilter = () => {
    const store = useDashboard();

    const { laporan } = usePage().props;

    const filtererKategoriDuplicate = laporan.map(
        (item) => item.detail_kategori.nama
    );

    // hapus duplikat
    const filtererKategori = filtererKategoriDuplicate.filter((item, index) => {
        return filtererKategoriDuplicate.indexOf(item) === index;
    });

    useEffect(() => {
        store.setKategoriSelected(filtererKategori);
    }, []);

    return (
        <CustomModal
            title={"Filter Kategori"}
            show={store.showModalFilter}
            setShow={store.handleModalFilter}
        >
            <div>
                {" "}
                <label className="flex items-center">
                    <input
                        className="checkbox checkbox-xs"
                        type="checkbox"
                        value="All"
                        onChange={() => store.handleAllCheckboxes(filtererKategori)}
                        checked={store.kategoriSelected.length === filtererKategori.length}
                        name=""
                        id=""
                    />
                    <span className="ml-2">Pilih Semua</span>
                </label>
            </div>
            <div className="flex flex-row flex-wrap gap-3">
                {filtererKategori.map((item, i) => (
                    <label key={i} className="flex items-center">
                        <input
                            className="checkbox checkbox-xs"
                            type="checkbox"
                            value={item}
                            onChange={() => store.handleCheckboxes(item)}
                            checked={store.kategoriSelected.includes(item)}
                            name=""
                            id=""
                        />
                        <span className="ml-2">{item}</span>
                    </label>
                ))}
            </div>
            <div className="flex justify-end">
                <button
                    onClick={store.handleModalFilter}
                    className="btn bg-slate-900  hover:bg-slate-950 mt-3 text-white w-fit"
                >
                    SAVE
                </button>
            </div>
        </CustomModal>
    );
};

const OverlayChart = () => {
    const { statistik, report, kategori } = usePage().props;

    const store = useDashboard();

    const pieOptions = {
        series: kategori.map((item) => item.laporan_count),
        options: {
            chart: {
                width: 380,
                type: "pie",
            },
            legend: {
                show: false,
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
                <div
                    onClick={store.handleModalFilter}
                    className="bg-white rounded-md flex items-center border-2 p-3"
                >
                    <MdOutlineFilterAlt />
                </div>
                {/* <div className="bg-white rounded-md border-2 pr-3">
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
                </div> */}
            </div>
            <div className="md:grid grid-cols-3 gap-3 hidden">
                <div className="bg-white border-2 h-[300px] rounded-md pointer-events-auto flex flex-col px-3 py-2">
                    <h1 className="font-semibold">Statistik</h1>
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
                    <h1 className="font-semibold">Laporan</h1>
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
                    <h1 className="font-semibold">Kejahatan & Kecelakaan</h1>
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
