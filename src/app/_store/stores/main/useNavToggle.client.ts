import { create } from "zustand";

interface Store {
  isOpen: boolean;
  toggle: () => void;
}

const useNavToggle = create<Store>()((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));

export default useNavToggle;
