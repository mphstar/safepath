import React, { useState } from "react";
import AdminLayout from "../../Components/Templates/AdminLayout";
import NoDataTable from "../../Components/Molecules/NoDataTable";
import { FaEdit, FaTrash } from "react-icons/fa";
import Pagination from "../../Components/Molecules/Pagination";
import CustomModal from "../../Components/Molecules/CustomModal";
import { fetcher } from "../../Utils/Fetcher";
import useSWR, { mutate } from "swr";
import GenerateUrl from "../../Utils/GenerateUrl";
import { debounce } from "../../Utils/Debounce";
import Swal from "sweetalert2";
import HitApi from "../../Utils/HitApi";
import DeleteData from "../../Utils/DeleteData";
import useKategoriKecelakaan from "../../Stores/useKategoriKecelakaan";
import { Link } from "@inertiajs/react";

const KategoriKecelakaan = () => {
    const store = useKategoriKecelakaan();

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const URL = GenerateUrl(
        "/api/v1/kategori/kecelakaan",
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
        <AdminLayout title="Kecelakaan">
            <MyModal URL={URL} />
            <div className="w-full h-full flex flex-col px-3 py-4">
                <div className="flex flex-row mb-8 cursor-pointer">
                    <Link href="/admin/kategori/kejahatan">
                        <div className="px-3 py-2 hover:bg-gray-100">Kejahatan</div>
                    </Link>
                    <Link href="/admin/kategori/kecelakaan">
                        <div className="px-3 py-2 bg-primary text-white rounded-md">
                            Kecelakaan
                        </div>
                    </Link>
                </div>
                <div className="flex items-center w-full gap-4 mb-3">
                    <label className="input input-bordered flex w-full items-center gap-2 max-w-[200px] md:max-w-[300px]">
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
                    <div className="flex-1 justify-end flex w-full">
                        <button
                            onClick={() => {
                                store.clearForm();
                                store.handleModal();
                            }}
                            className="btn bg-[#52C12C] text-white hover:bg-green-500 w-fit"
                        >
                            <p className="flex">Tambah</p>
                        </button>
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
                                            <th>Nama Kategori</th>
                                            <th>Tanggal</th>
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
                                                <td>{item.nama}</td>
                                                <td>
                                                    {new Date(
                                                        item.created_at
                                                    ).toLocaleString()}
                                                </td>
                                                <td>
                                                    <div className="flex gap-2 items-center">
                                                        {/* button edit */}
                                                        <button
                                                            onClick={() => {
                                                                store.setForm({
                                                                    id: item.id,
                                                                    nama: item.nama,
                                                                });
                                                                store.handleModal();
                                                            }}
                                                            className="btn btn-sm h-fit py-3 bg-[#FF9315] text-white hover:bg-orange-500"
                                                        >
                                                            <FaEdit size={15} />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                DeleteData(
                                                                    `/api/v1/kategori/kejahatan?id=${item.id}`,
                                                                    () => {
                                                                        mutate(
                                                                            URL
                                                                        );
                                                                    }
                                                                );
                                                            }}
                                                            className="btn btn-sm h-fit py-3 bg-[#E84141] text-white hover:bg-red-600"
                                                        >
                                                            <FaTrash
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

const MyModal = ({ URL }) => {
    const store = useKategoriKecelakaan();

    const handleSubmit = (e) => {
        e.preventDefault();

        Swal.fire({
            title: "Konfirmasi",
            text:
                store.form.option == "tambah"
                    ? "Apakah anda yakin ingin menambahkan data?"
                    : "Apakah anda yakin ingin mengubah data?",
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
                    url: "/api/v1/kategori/kecelakaan",
                    method: store.form.option == "tambah" ? "POST" : "PUT",
                    body: store.form.field,
                    onSuccess: () => {
                        Swal.fire(
                            "Berhasil",
                            store.form.option == "tambah"
                                ? "Data berhasil ditambahkan"
                                : "Data berhasil diubah",
                            "success"
                        );

                        store.clearForm();

                        store.handleModal();
                        mutate(URL);
                    },
                    onError: () => {
                        // Swal.fire("Gagal", "Data gagal ditambahkan", "error");
                    },
                });
            }
        });
    };

    return (
        <CustomModal
            show={store.modal}
            setShow={() => store.handleModal()}
            title={
                store.form.option == "tambah"
                    ? "Tambah Kategori"
                    : "Edit Kategori"
            }
        >
            <form onSubmit={handleSubmit} action="">
                <label className="form-control w-full py-2">
                    <div className="label">
                        <span className="label-text required">
                            Nama Kategori
                        </span>
                    </div>
                    <input
                        name="nama"
                        value={store.form.field.nama}
                        onChange={store.handleForm}
                        type="text"
                        placeholder=""
                        className="w-full border-2 outline-none px-3 py-2 rounded-[5px]"
                    />
                </label>

                <button className="btn bg-slate-800 hover:bg-slate-950 text-white w-full mt-3">
                    SAVE
                </button>
            </form>
        </CustomModal>
    );
};

export default KategoriKecelakaan;
