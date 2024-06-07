import HitApi from "./HitApi";
import Swal from "sweetalert2";

const DeleteData = (url, onSuccess = () => {}) => {
    Swal.fire({
        title: "Konfirmasi",
        text: "Apakah anda yakin ingin menghapus data?",
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
                url: url,
                method: "DELETE",
                option: "delete",
                onSuccess: () => {
                    Swal.fire("Berhasil", "Data berhasil dihapus", "success");

                    onSuccess();
                },
            });
        }
    });
};

export default DeleteData;
