import React from "react";

const CustomModal = ({ show, setShow, children, title, className }) => {
    return (
        <>
            <div
                className={`bg-white h-fit max-h-[90%] w-[400px] max-w-[90%] px-[27px] py-[23px] flex rounded-lg fixed z-[201] mx-auto right-[50%] translate-x-[50%] top-[50%] -translate-y-[50%] ${
                    show ? "scale-100" : "scale-0"
                } duration-300 ease-in-out ${className}`}
            >
                <div className="flex flex-col w-full flex-1">
                    <div className="flex flex-row w-full items-center h-fit mb-[23px]">
                        <h1
                            className={`flex-1 text-[18px] font-semibold text-md`}
                        >
                            {title}
                        </h1>
                        <div onClick={setShow}>
                            <svg
                                className=""
                                width="13"
                                height="13"
                                viewBox="0 0 13 13"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M10.5535 0.419754L6.5 4.47326L2.44651 0.419754C2.17773 0.150991 1.81321 1.69134e-06 1.43313 1.69134e-06C1.05304 1.69134e-06 0.688517 0.150991 0.419754 0.419754C0.150989 0.688517 0 1.05304 0 1.43313C0 1.81321 0.150989 2.17773 0.419754 2.44651L4.47326 6.5L0.419754 10.5535C0.150989 10.8223 0 11.1868 0 11.5669C0 11.947 0.150989 12.3115 0.419754 12.5802C0.688517 12.849 1.05304 13 1.43313 13C1.81321 13 2.17773 12.849 2.44651 12.5802L6.5 8.52675L10.5535 12.5802C10.8223 12.849 11.1868 13 11.5669 13C11.947 13 12.3115 12.849 12.5802 12.5802C12.849 12.3115 13 11.947 13 11.5669C13 11.1868 12.849 10.8223 12.5802 10.5535L8.52675 6.5L12.5802 2.44651C12.849 2.17773 13 1.81321 13 1.43313C13 1.05304 12.849 0.688517 12.5802 0.419754C12.3115 0.150991 11.947 0 11.5669 0C11.1868 0 10.8223 0.150991 10.5535 0.419754Z" />
                            </svg>
                        </div>
                    </div>
                    <div className="flex flex-col overflow-y-auto gap-4 w-full custom-scrollbar">
                        {children}
                    </div>
                </div>
            </div>
            <div
                onClick={setShow}
                className={`duration-500 ease-in-out min-h-[100dvh] w-screen flex ${
                    show
                        ? "bg-black/50 backdrop-blur-sm pointer-events-auto"
                        : "bg-black/0 backdrop-blur-none pointer-events-none"
                } fixed inset-0 z-[200]`}
            ></div>
        </>
    );
};

export default CustomModal;
