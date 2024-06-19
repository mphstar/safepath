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

const Berita = () => {
    const store = useBerita();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const URL = GenerateUrl(
        "/api/v1/berita",
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
        <AdminLayout title="News">
            <MyModal URL={URL} />
            <DetailModal />
            <div className="w-full h-full flex flex-col px-3 py-4">
                <div className="flex items-center w-full gap-4 mb-3">
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
                    <div className="flex-1 justify-end flex w-full">
                        <button
                            onClick={() => {
                                store.clearForm();
                                store.handleModal();
                            }}
                            className="btn bg-[#52C12C] text-white hover:bg-green-500 w-fit"
                        >
                            <p className="flex">Add</p>
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
                                            <th>Judul</th>
                                            <th>Deskripsi</th>
                                            <th>Penulis</th>
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
                                                <td>{item.judul}</td>
                                                <td>{item.deskripsi}</td>
                                                <td>{item.penulis}</td>
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
                                                        {/* button edit */}
                                                        <button
                                                            onClick={() => {
                                                                store.setForm({
                                                                    id: item.id,
                                                                    judul: item.judul,
                                                                    deskripsi:
                                                                        item.deskripsi,
                                                                    penulis:
                                                                        item.penulis,
                                                                    gambar: `/uploads/berita/${item.gambar}`,
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
                                                                    `/api/v1/berita?id=${item.id}`,
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

const DetailModal = () => {
    const store = useBerita();

    return (
        <CustomModal
            show={store.detailModal}
            setShow={() => store.handleDetailModal()}
            title={"Detail Berita"}
        >
            {store.itemSelected && (
                <div className="flex flex-col mt-2">
                    <img
                        className="h-[200px] mb-4 rounded-md"
                        src={`/uploads/berita/${store.itemSelected.gambar}`}
                        alt="Image"
                    />
                    <h1 className="font-semibold text-lg">
                        {store.itemSelected.judul}
                    </h1>
                    <p className="text-xs">
                        Penulis: {store.itemSelected.penulis}
                    </p>

                    <p className="text-sm mt-4">
                        {store.itemSelected.deskripsi}
                    </p>
                </div>
            )}
        </CustomModal>
    );
};

const MyModal = ({ URL }) => {
    const store = useBerita();

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

                let formData = new FormData();
                formData.append("judul", store.form.field.judul);
                formData.append("deskripsi", store.form.field.deskripsi);
                formData.append("penulis", store.form.field.penulis);
                if (store.form.field.gambar instanceof File) {
                    formData.append("gambar", store.form.field.gambar);
                }
                formData.append("id", store.form.field.id);

                HitApi({
                    url:
                        store.form.option == "tambah"
                            ? "/api/v1/berita"
                            : `/api/v1/berita/update`,
                    isFormData: true,
                    method: "POST",
                    body: formData,
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
                store.form.option == "tambah" ? "Tambah Berita" : "Edit Berita"
            }
        >
            <form onSubmit={handleSubmit} action="">
                <label className="form-control w-full py-2">
                    <div className="label">
                        <span className="label-text required">Gambar</span>
                    </div>
                    <div className="w-full border-2 rounded-md h-36 relative">
                        {store.form.field.gambar && (
                            <img
                                src={
                                    store.form.gambarPreview
                                        ? store.form.gambarPreview
                                        : store.form.field.gambar
                                }
                                alt="Image Preview"
                                className="absolute top-0 left-0 w-full h-full object-cover"
                            />
                        )}
                        <input
                            type="file"
                            name="gambar"
                            onChange={store.handleImage}
                            className="w-full h-full opacity-0"
                        />
                        {!store.form.field.gambar && (
                            <div className="flex flex-col top-0 left-0 pointer-events-none w-full h-full items-center justify-center absolute">
                                <MdOutlineCloudUpload />
                                <p className="text-sm">Upload Gambar</p>
                            </div>
                        )}
                    </div>
                </label>
                <label className="form-control w-full py-2">
                    <div className="label">
                        <span className="label-text required">Judul</span>
                    </div>
                    <input
                        name="judul"
                        value={store.form.field.judul}
                        onChange={store.handleForm}
                        type="text"
                        placeholder=""
                        className="w-full border-2 outline-none px-3 py-2 rounded-[5px]"
                    />
                </label>
                <label className="form-control w-full py-2">
                    <div className="label">
                        <span className="label-text required">Konten</span>
                    </div>
                    <textarea
                        className="w-full border-2 outline-none h-36 px-3 py-2 rounded-[5px]"
                        name="deskripsi"
                        onChange={store.handleForm}
                        value={store.form.field.deskripsi}
                    ></textarea>
                </label>

                <label className="form-control w-full py-2">
                    <div className="label">
                        <span className="label-text required">Penulis</span>
                    </div>
                    <input
                        name="penulis"
                        value={store.form.field.penulis}
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

export default Berita;
