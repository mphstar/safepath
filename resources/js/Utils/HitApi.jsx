import Swal from "sweetalert2";

const HitApi = async ({
    onFinally = () => {},
    onSuccess = () => {},
    onError = () => {},
    url,
    method,
    body,
    option,
    isFormData = false,
}) => {
    try {
        const storeData = await fetch(url, {
            body: isFormData ? body : JSON.stringify(body),
            method: method,
            headers: !isFormData ? { "Content-Type": "application/json" } : {},
        });

        const result = await storeData.json();
        if (storeData.status === 201 || storeData.status === 200) {
            onSuccess();
        } else {
            Swal.fire("Gagal", result.errors, "error");

            onError();
        }
    } catch (error) {
        console.log("Gagal memproses data  : ", error);
    } finally {
        onFinally();
    }
};

export default HitApi;
