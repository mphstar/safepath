import React from "react";
import AdminLayout from "../../Components/Templates/AdminLayout";
import NoDataTable from "../../Components/Molecules/NoDataTable";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import Pagination from "../../Components/Molecules/Pagination";

const User = () => {
    return (
        <AdminLayout title="User">
            <div className="w-full h-full flex flex-col px-3 py-4">
                <div className="flex items-center w-full gap-4 mb-3">
                    <label className="input input-bordered flex w-full items-center gap-2 max-w-[200px] md:max-w-[300px]">
                        <input
                            type="text"
                            className="w-full"
                            placeholder="Search"
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
                            onClick={() => {}}
                            className="btn bg-[#52C12C] text-white hover:bg-green-500 w-fit"
                        >
                            <p className="flex">Add</p>
                        </button>
                    </div>
                </div>
                <NoDataTable
                    isLoading={false}
                    isError={false}
                    message={true ? "Failed get data" : "No data"}
                    isEmpty={false}
                >
                    {true && (
                        <>
                            <div className="overflow-x-auto">
                                <table className="table">
                                    {/* head */}
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Created At</th>
                                            <th>Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="hover border-t-2">
                                            <th>1</th>
                                            <td>Mphstar</td>
                                            <td>mphstar@gmail.com</td>
                                            <td>24-07-2024</td>
                                            <td>
                                                <div className="flex gap-2 items-center">
                                                    {/* button edit */}
                                                    <button
                                                        onClick={() => {}}
                                                        className="btn btn-sm h-fit py-3 bg-[#FF9315] text-white hover:bg-orange-500"
                                                    >
                                                        <FaEdit size={15} />
                                                    </button>
                                                    <button
                                                        onClick={() => {}}
                                                        className="btn btn-sm h-fit py-3 bg-[#E84141] text-white hover:bg-red-600"
                                                    >
                                                        <FaTrash size={15} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <Pagination
                                total={52}
                                showItem={10}
                                page={1}
                                setPage={null}
                                limit={5}
                            />
                        </>
                    )}
                </NoDataTable>
            </div>
        </AdminLayout>
    );
};

export default User;
