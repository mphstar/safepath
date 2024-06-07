import { create } from "zustand";

const useKategoriKejahatan = create((set) => ({
    modal: false,
    handleModal: () => set((state) => ({ modal: !state.modal })),
    form: {
        field: {
            nama: "",
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
                    nama: "",
                },
                option: "tambah",
            },
        })),
}));

export default useKategoriKejahatan;
