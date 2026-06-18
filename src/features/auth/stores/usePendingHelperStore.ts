import { create } from 'zustand';

interface PendingHelperData {
  professionalData: any;
  locationData: any;
  docsData: {
    profilePicture?: File;
    cnicFront?: File;
    cnicBack?: File;
  };
}

interface PendingHelperStore {
  pendingHelperData: PendingHelperData | null;
  setPendingHelperData: (data: PendingHelperData) => void;
  clearPendingHelperData: () => void;
}

export const usePendingHelperStore = create<PendingHelperStore>((set) => ({
  pendingHelperData: null,
  setPendingHelperData: (data) => set({ pendingHelperData: data }),
  clearPendingHelperData: () => set({ pendingHelperData: null }),
}));
