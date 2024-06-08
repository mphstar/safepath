import { create } from "zustand";

const useBerita = create((set) => ({
    modal: false,
    detailModal: false,
    handleDetailModal: () =>
        set((state) => ({ detailModal: !state.detailModal })),
    itemSelected: undefined,
    setItemSelected: (data) => set({ itemSelected: data }),
    handleModal: () => set((state) => ({ modal: !state.modal })),
    form: {
        field: {
            judul: "",
            deskripsi: "",
            gambar: undefined,
            penulis: "",
        },
        gambarPreview: undefined,
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
    handleImage: (e) => {
        const file = e.target.files[0];
        set((state) => ({
            form: {
                ...state.form,
                field: {
                    ...state.form.field,
                    gambar: file,
                },
                gambarPreview: URL.createObjectURL(file),
            },
        }));
    },
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
                    judul: "",
                    deskripsi: "",
                    gambar: undefined,
                    penulis: "",
                },
                option: "tambah",
            },
        })),
}));

export default useBerita;
