import React from 'react'

const NoDataTable = ({ children, isLoading = false, isError = false, isEmpty = true, message = "Tidak ada data" }) => {

    if (isLoading) {
        return <div className='flex flex-1 flex-col items-center justify-center'>
            <svg className='animate-spin fill-primary dark:fill-primary-dark' width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4V2C10.6868 2 9.38642 2.25866 8.17317 2.7612C6.95991 3.26375 5.85752 4.00035 4.92893 4.92893C3.05357 6.8043 2 9.34784 2 12H4C4 9.87827 4.84285 7.84344 6.34315 6.34315C7.84344 4.84285 9.87827 4 12 4Z" />
            </svg>
            <p className='font-bold py-4'>Loading...</p>
        </div>
    }

    if (isEmpty || isError) {
        return <div className='flex flex-1 flex-col items-center justify-center'>
            <img className='w-full h-full max-h-[300px] ' src="/assets/images/nodata.svg" alt="No Data Images" />
            <p className='font-bold'>{message}</p>
        </div>
    }

    return children
}

export default NoDataTable