import React, { useEffect, useState } from "react";
import AdminLayout from "../../Components/Templates/AdminLayout";
import { FaArrowDown, FaSearch } from "react-icons/fa";
import { FaArrowDownShortWide } from "react-icons/fa6";
import ReactApexChart from "react-apexcharts";
import Swal from "sweetalert2";

const Grafik = () => {
    const [tahun, setTahun] = useState(new Date().getFullYear());

    const [chartOptions, setChartOptions] = useState({
        series: [
            {
                name: "Kejahatan",
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            },
            {
                name: "Kecelakaan",
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            },
        ],
        xaxis: {
            categories: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
            ],
        },
    });

    const [kecamatan, setKecamatan] = useState({
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
        series: [],
        xaxis: {
            categories: [],
        },
    });

    const [countKategori, setCountKategori] = useState({
        series: [],
        xaxis: {
            categories: [],
        },
    });

    const [date, setDate] = useState({
        start: `${new Date().getFullYear()}-01-01`,
        end: `${new Date().getFullYear()}-12-31`,
    });

    const filterRange = () => {
        if (date.start === "" || date.end === "") {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Tanggal tidak boleh kosong!",
            });
            return;
        }

        fetchRange({ startFrom: date.start, endTo: date.end });
    };

    const fetchStatistic = async ({ tahun }) => {
        // fetch data from API
        const response = await fetch("/api/v1/grafik/tahun", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                tahun: tahun,
            }),
        });

        const data = await response.json();
        setChartOptions({
            ...chartOptions,
            series: [
                {
                    name: "Kejahatan",
                    data: data.result.kejahatan.map((item) => item.total),
                },
                {
                    name: "Kecelakaan",
                    data: data.result.kecelakaan.map((item) => item.total),
                },
            ],
        });
    };
    const fetchRange = async ({ startFrom, endTo }) => {
        // fetch data from API
        const response = await fetch("/api/v1/grafik/range", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                date_from: startFrom,
                date_to: endTo,
            }),
        });

        const data = await response.json();

        setKecamatan({
            ...kecamatan,
            series: [
                {
                    name: "Kejahatan",
                    data: data.result.report.kejahatan.map(
                        (item) => item.total
                    ),
                },
                {
                    name: "Kecelakaan",
                    data: data.result.report.kecelakaan.map(
                        (item) => item.total
                    ),
                },
            ],
            xaxis: {
                categories: data.result.report.kejahatan.map(
                    (item) => item.kecamatan
                ),
            },
        });

        setCountKategori({
            ...countKategori,
            series: [
                {
                    name: "Kategori",
                    data: data.result.countKategori.map(
                        (item) => item.laporan_count
                    ),
                },
            ],
            xaxis: {
                categories: data.result.countKategori.map((item) => item.nama),
            },
        });
    };

    useEffect(() => {
        fetchStatistic({ tahun: new Date().getFullYear() });
        fetchRange({ startFrom: date.start, endTo: date.end });
        return () => {};
    }, []);

    return (
        <AdminLayout title="Infografik">
            <div className="w-full h-full flex flex-col px-3 py-4">
                <div className="flex flex-row items-center gap-3">
                    <div>Filter Tahun</div>
                    <div className="relative">
                        <select
                            className="border-2 px-3 appearance-none py-2 pr-8 rounded-md"
                            name=""
                            value={tahun}
                            onChange={(e) => {
                                setTahun(e.target.value);
                                fetchStatistic({ tahun: e.target.value });
                            }}
                            id=""
                        >
                            {/* tampilkan tahun sekarang sampai 20 tahun kebelakang */}
                            {Array.from({ length: 30 }).map((_, index) => (
                                <option
                                    value={new Date().getFullYear() - index}
                                    key={index}
                                >
                                    {new Date().getFullYear() - index}
                                </option>
                            ))}
                        </select>
                        <FaArrowDownShortWide className="absolute right-2 top-0 h-full" />
                    </div>
                </div>
                <div>
                    <div className="bg-white h-[500px] w-full rounded-md pointer-events-auto flex flex-col mt-4 py-2">
                        <h1 className="font-semibold">Statistik</h1>
                        <div className="w-full h-full mt-6">
                            <ReactApexChart
                                options={chartOptions}
                                series={chartOptions.series}
                                type="line"
                                height={"100%"}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <div>Filter Tahun</div>
                    <div className="flex items-center gap-2">
                        <input
                            className="border-2 px-3 appearance-none py-2 pr-2 rounded-md"
                            type="date"
                            name=""
                            value={date.start}
                            onChange={(e) =>
                                setDate({ ...date, start: e.target.value })
                            }
                            id=""
                        />
                        <span>-</span>
                        <input
                            className="border-2 px-3 appearance-none py-2 pr-2 rounded-md"
                            type="date"
                            name=""
                            value={date.end}
                            onChange={(e) =>
                                setDate({ ...date, end: e.target.value })
                            }
                            id=""
                        />
                        <button
                            onClick={() => filterRange()}
                            className="bg-slate-900 btn btn-sm h-full hover:bg-slate-950 text-white"
                        >
                            <FaSearch />
                        </button>
                    </div>
                </div>
                <div>
                    <div className="bg-white h-[500px] w-full rounded-md pointer-events-auto flex flex-col mt-4 py-2">
                        <h1 className="font-semibold">Laporan per Kecamatan</h1>
                        <div className="w-full h-full mt-6">
                            <ReactApexChart
                                options={kecamatan}
                                series={kecamatan.series}
                                type="bar"
                                height={"100%"}
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <div className="bg-white h-[500px] w-full rounded-md pointer-events-auto flex flex-col mt-4 py-2">
                        <h1 className="font-semibold">
                            Akumulasi Kasus per Kategori
                        </h1>
                        <div className="w-full h-full mt-6">
                            <ReactApexChart
                                options={countKategori}
                                series={countKategori.series}
                                type="bar"
                                height={"100%"}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Grafik;
