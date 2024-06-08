import { create } from "zustand";

const useConfirmReport = create((set) => ({
    detailModal: false,
    handleDetailModal: () =>
        set((state) => ({ detailModal: !state.detailModal })),
    itemSelected: undefined,
    setItemSelected: (data) => set({ itemSelected: data }),
}));

export default useConfirmReport;
