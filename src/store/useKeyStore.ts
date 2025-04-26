import { create } from "zustand"

type KeyStore = {
 keysLoading: boolean
 setKeysLoading: (loading: boolean) => void
}

export const  useKeyStore = create<KeyStore>((set) => ({
 keysLoading: true,
 setKeysLoading: (loading) => set({ keysLoading: loading })
}))