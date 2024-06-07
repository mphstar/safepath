import { create } from "zustand";

const usePolsek = create((set) => ({
    modal: false,
    handleModal: () => set((state) => ({ modal: !state.modal })),
    form: {
        field: {
            nama_kecamatan: "",
            kontak: "",
            penanggungjawab: "",
        },
        option: "tambah",
    },
    handleForm: (e) =>
        set((state) => ({
            form: {
                ...state.form,
                field: {
                    ...state.form.field,
                    [e.target.name]: e.target.value,
                },
            },
        })),
    setForm: (data) =>
        set((state) => ({
            form: {
                ...state.form,
                field: data,
                option: "edit",
            },
        })),
    clearForm: () =>
        set((state) => ({
            form: {
                field: {
                    nama_kecamatan: "",
                    kontak: "",
                    penanggungjawab: "",
                },
                option: "tambah",
            },
        })),
}));

export default usePolsek;
