import { create } from "zustand"

type TypingState = {
 typingUsers: Record<string, boolean>
 setTyping: (userId: string, isTyping: boolean) => void
}

export const useTypingStore = create<TypingState>((set) => ({
 typingUsers: {},
 setTyping: (userId, isTyping) =>
  set((state) => ({
   typingUsers: {
    ...state.typingUsers,
    [userId]: isTyping
   }
  }))
}))