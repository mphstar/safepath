import { create } from "zustand";

const useDashboard = create((set) => ({
    showModalFilter: false,
    handleModalFilter: () =>
        set((state) => ({ showModalFilter: !state.showModalFilter })),

    kategoriSelected: [],
    setKategoriSelected: (kategori) => set({ kategoriSelected: kategori }),

    handleCheckboxes: (kategori) => {
        let kategoriSelected = [...useDashboard.getState().kategoriSelected];
        if (kategoriSelected.includes(kategori)) {
            kategoriSelected = kategoriSelected.filter(
                (item) => item !== kategori
            );
        } else {
            kategoriSelected.push(kategori);
        }
        useDashboard.setState({ kategoriSelected });
    },

    handleAllCheckboxes: (kategori) => {
        let kategoriSelected = [...useDashboard.getState().kategoriSelected];
        if (kategoriSelected.length > 0) {
            kategoriSelected = [];
        } else {
            kategoriSelected = kategori;
        }
        useDashboard.setState({ kategoriSelected });
    },
}));

export default useDashboard;
