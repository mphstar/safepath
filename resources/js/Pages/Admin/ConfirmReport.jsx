import React, { useState } from "react";
import AdminLayout from "../../Components/Templates/AdminLayout";
import NoDataTable from "../../Components/Molecules/NoDataTable";
import { FaEdit, FaInfo, FaTrash } from "react-icons/fa";
import Pagination from "../../Components/Molecules/Pagination";
import CustomModal from "../../Components/Molecules/CustomModal";
import { fetcher } from "../../Utils/Fetcher";
import useSWR, { mutate } from "swr";
import useUser from "../../Stores/useUser";
import GenerateUrl from "../../Utils/GenerateUrl";
import { debounce } from "../../Utils/Debounce";
import { IoEye, IoEyeOff } from "react-icons/io5";
import Swal from "sweetalert2";
import HitApi from "../../Utils/HitApi";
import DeleteData from "../../Utils/DeleteData";
import usePolsek from "../../Stores/usePolsek";
import useBerita from "../../Stores/useBerita";
import { MdInfoOutline, MdOutlineCloudUpload } from "react-icons/md";
import useConfirmReport from "../../Stores/useConfirmReport";

const ConfirmReport = () => {
    const store = useConfirmReport();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const URL = GenerateUrl(
        "/api/v1/report/confirm",
        `page=${page}`,
        `search=${encodeURIComponent(search)}`
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
        <AdminLayout title="Confirm Report">
            <DetailModal URL={URL} />

            <div className="w-full h-full flex flex-col px-3 py-4">
                <div className="flex items-center w-full gap-4 mb-3 justify-between">
                    <label className="input input-bordered flex w-full items-center gap-2 max-w-[200px] md:max-w-[300px]">
                        <input
                            type="text"
                            className="w-full"
                            placeholder="Search"
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
                    <div className="flex flex-row">
                        <a href="/admin/history/export?status=menunggu">
                            <button className="btn bg-green-500 hover:bg-green-600 px-3 py-2 text-white">
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
                                            <th>Lokasi</th>
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
                                                <td>{item.lokasi}</td>
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

const DetailModal = ({ URL }) => {
    const store = useConfirmReport();

    const handleReport = ({ isConfirm = true }) => {
        Swal.fire({
            title: "Konfirmasi",
            text: `Apakah anda yakin ingin ${
                isConfirm ? "konfirmasi" : "menolak"
            } data?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ya",
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Loading",
                    html: '<div class="body-loading"><div class="loadingspinner"></div></div>', // add html attribute if you want or remove
                    allowOutsideClick: false,
                    showConfirmButton: false,
                });

                HitApi({
                    url: `/api/v1/report/${isConfirm ? "confirm" : "reject"}`,
                    method: "POST",
                    body: {
                        id: store.itemSelected.id,
                    },
                    onSuccess: () => {
                        Swal.fire(
                            "Berhasil",
                            `Data berhasil ${
                                isConfirm ? "diterima" : "ditolak"
                            }`,
                            "success"
                        ).then(() => {
                            store.handleDetailModal();
                            mutate(URL);
                        });
                    },
                });
            }
        });
    };

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

                        <div className="flex gap-2">
                            <button
                                onClick={() =>
                                    handleReport({ isConfirm: false })
                                }
                                className="btn bg-red-500 hover:bg-red-600 text-white w-fit mt-6"
                            >
                                Tolak
                            </button>
                            <button
                                onClick={() =>
                                    handleReport({ isConfirm: true })
                                }
                                className="btn bg-slate-800 hover:bg-slate-950 text-white w-fit mt-6"
                            >
                                Confirm
                            </button>
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
                            <p className="w-[100px] truncate">Lokasi</p>
                            <p className="px-2">:</p>
                            <p>{store.itemSelected.lokasi}</p>
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

export default ConfirmReport;
