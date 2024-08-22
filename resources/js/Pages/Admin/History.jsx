import React, { useState } from "react";
import AdminLayout from "../../Components/Templates/AdminLayout";
import NoDataTable from "../../Components/Molecules/NoDataTable";
import { FaArrowDown } from "react-icons/fa";
import Pagination from "../../Components/Molecules/Pagination";
import CustomModal from "../../Components/Molecules/CustomModal";
import { fetcher } from "../../Utils/Fetcher";
import useSWR, { mutate } from "swr";
import GenerateUrl from "../../Utils/GenerateUrl";
import { debounce } from "../../Utils/Debounce";
import { MdInfoOutline } from "react-icons/md";
import useHistory from "../../Stores/useHistory";
import HitApi from "../../Utils/HitApi";
import { usePage } from "@inertiajs/react";
import Swal from "sweetalert2";

const History = () => {
    const store = useHistory();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const URL = GenerateUrl(
        "/api/v1/history",
        `page=${page}`,
        `search=${encodeURIComponent(search)}`,
        `filter=${filter}`
    );
    const { data, error, isLoading } = useSWR(URL, fetcher);

    const handleSearch = debounce((term) => {
        setSearch(term);
    }, 500);

    const handleChangeSearch = (e) => {
        const { value } = e.target;
        setPage(1);
        handleSearch(value);
    };

    return (
        <AdminLayout title="Data Laporan">
            <DetailModal URL={URL} />
            <FormImport url={URL} />

            <div className="w-full h-full flex flex-col px-3 py-4">
                <div className="flex flex-col md:flex-row items-center justify-between w-full gap-4 mb-3">
                    <label className="input input-bordered flex w-full items-center gap-2  md:max-w-[300px]">
                        <input
                            type="text"
                            className="w-full"
                            placeholder="Cari"
                            onChange={handleChangeSearch}
                        />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="w-4 h-4 opacity-70"
                        >
                            <path
                                fillRule="evenodd"
                                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </label>
                    <div className="flex flex-row gap-2 w-full md:w-fit">
                        <div className="border-2 relative rounded-md w-full md:w-fit">
                            <select
                                className="appearance-none h-full px-2 pr-8"
                                name=""
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                id=""
                            >
                                <option value="all">Semua</option>
                                <option value="ditolak">Ditolak</option>
                                <option value="disetujui">Disetujui</option>
                            </select>
                            <FaArrowDown
                                size={12}
                                className="absolute top-0 right-2 h-full"
                            />
                        </div>
                        <button
                            onClick={() => store.handleFormImport()}
                            className="btn bg-orange-500 hover:bg-orange-600 px-3 py-2 text-white"
                        >
                            Import
                        </button>
                        <a href="/admin/history/export?status=history">
                            <button className="btn bg-blue-500 hover:bg-blue-600 px-3 py-2 text-white">
                                Export
                            </button>
                        </a>
                    </div>
                </div>
                <NoDataTable
                    isLoading={isLoading}
                    isError={error}
                    message={error ? "Failed get data" : "No data"}
                    isEmpty={
                        data && data.result.data.length == 0 ? true : false
                    }
                >
                    {data && (
                        <>
                            <div className="overflow-x-auto">
                                <table className="table">
                                    {/* head */}
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Pengirim</th>
                                            <th>Kategori</th>
                                            <th>No HP</th>
                                            <th>Kecamatan</th>
                                            <th>Status</th>
                                            <th>Created At</th>
                                            <th>Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.result.data.map((item, index) => (
                                            <tr
                                                key={index}
                                                className="hover border-t-2"
                                            >
                                                <th>
                                                    {data.result.from + index}
                                                </th>
                                                <td>
                                                    <div className="flex flex-col">
                                                        <p className="font-semibold">
                                                            {item.user.nama}
                                                        </p>
                                                        <p className="text-sm text-gray-400">
                                                            {item.user.email}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="flex flex-col">
                                                        <p className="">
                                                            {
                                                                item
                                                                    .detail_kategori
                                                                    .kategori
                                                                    .nama
                                                            }
                                                        </p>
                                                        <p className="text-sm text-gray-400">
                                                            {
                                                                item
                                                                    .detail_kategori
                                                                    .nama
                                                            }
                                                        </p>
                                                    </div>
                                                </td>
                                                <td>{item.user.nohp}</td>
                                                <td>
                                                    {item.polsek.nama_kecamatan}
                                                </td>
                                                <td>
                                                    <div
                                                        className={`text-xs px-3 py-1 rounded-md w-fit ${
                                                            item.status ==
                                                            "disetujui"
                                                                ? "bg-green-200 text-green-500"
                                                                : "bg-red-200 text-red-500"
                                                        }`}
                                                    >
                                                        {item.status}
                                                    </div>
                                                </td>
                                                <td>
                                                    {new Date(
                                                        item.created_at
                                                    ).toLocaleString()}
                                                </td>
                                                <td>
                                                    <div className="flex gap-2 items-center">
                                                        <button
                                                            onClick={() => {
                                                                store.setItemSelected(
                                                                    item
                                                                );
                                                                store.handleDetailModal();
                                                            }}
                                                            className="btn btn-sm h-fit py-3 bg-slate-800 text-white hover:bg-slate-950"
                                                        >
                                                            <MdInfoOutline
                                                                size={15}
                                                            />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <Pagination
                                total={data.result.total}
                                showItem={data.result.data.length}
                                page={page}
                                setPage={setPage}
                                limit={data.result.per_page}
                            />
                        </>
                    )}
                </NoDataTable>
            </div>
        </AdminLayout>
    );
};

const FormImport = ({ url }) => {
    const store = useHistory();
    const [file, setFile] = useState();

    const { props } = usePage();

    const handleSubmit = (e) => {
        e.preventDefault();

        Swal.fire({
            title: "Loading",
            html: '<div class="body-loading"><div class="loadingspinner"></div></div>', // add html attribute if you want or remove
            allowOutsideClick: false,
            showConfirmButton: false,
        });

        const formData = new FormData();
        formData.append("file", file);
        formData.append("user_id", props.auth.id);

        HitApi({
            url: "/api/v1/laporan/import",
            method: "POST",
            body: formData,
            isFormData: true,
            onSuccess: () => {
                Swal.fire("Berhasil", "Data berhasil diimport", "success");

                setFile(null);
                store.handleFormImport();
                mutate(url);
            },
            onError: () => {
                console.log("Error");
            },
            onFinally: () => {
                // Swal.close();
            },
        });
    };
    return (
        <CustomModal
            show={store.formImport}
            setShow={() => store.handleFormImport()}
            title={"Import Data"}
        >
            <form onSubmit={handleSubmit} action="">
                <div className="flex flex-col gap-4">
                    {/* <p className="text-sm text-gray-400">
                        Import data laporan dengan format excel
                    </p> */}
                    <p className="text-sm text-gray-400">
                        Unduh contoh laporan seperti pada format{" "}
                        <a className="text-blue-500 text-sm" href="#">
                            berikut
                        </a>
                    </p>
                    <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="file-input file-input-bordered"
                    />
                    <button className="btn bg-blue-500 hover:bg-blue-600 text-white">
                        Import
                    </button>
                </div>
            </form>
        </CustomModal>
    );
};

const DetailModal = ({ URL }) => {
    const store = useHistory();

    return (
        <CustomModal
            show={store.detailModal}
            setShow={() => store.handleDetailModal()}
            title={"Detail Laporan"}
            className={"w-[800px]"}
        >
            {store.itemSelected && (
                <div className="flex flex-col md:flex-row gap-3 relative">
                    <div className="flex-1 flex flex-col order-2 md:order-1">
                        <p className="my-4 font-semibold">Judul</p>
                        <p>
                            {store.itemSelected.detail_kategori.kategori.nama}
                        </p>

                        <p className="my-4 font-semibold">Deskripsi</p>
                        <p>{store.itemSelected.keterangan}</p>

                        <div className="flex gap-2 mt-7">
                            <div
                                className={`text-xs px-3 py-1 rounded-md ${
                                    store.itemSelected.status == "disetujui"
                                        ? "bg-green-200 text-green-500"
                                        : "bg-red-200 text-red-500"
                                }`}
                            >
                                {store.itemSelected.status}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col w-full md:w-[50%] order-1 md:order-2 md:border-l-2 md:pl-4 md:sticky h-fit md:top-0 md:left-0">
                        <p className="my-4 font-semibold">Data Diri</p>
                        <div className="flex flex-row">
                            <p className="w-[100px] truncate">Pengirim</p>
                            <p className="px-2">:</p>
                            <p>{store.itemSelected.user.nama}</p>
                        </div>
                        <div className="flex flex-row">
                            <p className="w-[100px] truncate">Email</p>
                            <p className="px-2">:</p>
                            <p>{store.itemSelected.user.email}</p>
                        </div>
                        <div className="flex flex-row">
                            <p className="w-[100px] truncate">No HP</p>
                            <p className="px-2">:</p>
                            <p>{store.itemSelected.user.nohp}</p>
                        </div>
                        <div className="flex flex-row">
                            <p className="w-[100px] truncate">Kategori</p>
                            <p className="px-2">:</p>
                            <p>{store.itemSelected.detail_kategori.nama}</p>
                        </div>
                        <div className="flex flex-row">
                            <p className="w-[100px] truncate">Kecamatan</p>
                            <p className="px-2">:</p>
                            <p>{store.itemSelected.polsek.nama_kecamatan}</p>
                        </div>
                        <div className="flex flex-row">
                            <p className="w-[100px] truncate">Lokasi</p>
                            <p className="px-2">:</p>
                            <a
                                className="text-blue-500"
                                target="_blank"
                                href={`http://maps.google.com?q=${store.itemSelected.lokasi}`}
                            >
                                Klik disini
                            </a>
                        </div>

                        <p className="my-4 font-semibold">Gambar</p>
                        <img
                            className="h-[200px] object-cover rounded-md"
                            src={`/uploads/laporan/${store.itemSelected.bukti_gambar}`}
                            alt="Gambar"
                        />
                    </div>
                </div>
            )}
        </CustomModal>
    );
};

export default History;
