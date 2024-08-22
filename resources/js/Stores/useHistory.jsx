import { create } from "zustand";

const useHistory = create((set) => ({
    detailModal: false,
    handleDetailModal: () =>
        set((state) => ({ detailModal: !state.detailModal })),
    formImport: false,
    handleFormImport: () => set((state) => ({ formImport: !state.formImport })),
    itemSelected: undefined,
    setItemSelected: (data) => set({ itemSelected: data }),
}));

export default useHistory;
