import { create } from "zustand"

export type Message = {
 id: string
 senderId: string
 receiverId: string
 ciphertext: string
 nonce: string
 createdAt: string
 text?: string
 pending?: boolean
}

type ChatStore = {
 messages: Message[]
 addMessage: (message: Message) => void
 clearMessages: () => void
 removePendingMessage: (tempId: string) => void
}

export const useChatStore = create<ChatStore>((set) => ({
 messages: [],
 addMessage: (message) =>
  set((state) => ({
   messages: [...state.messages, message]
  })),
clearMessages: () =>
  set(() =>
    ({ messages: [] })
  ),
removePendingMessage: (tempId) =>
  set((state) => ({
    messages: state.messages.filter((message) => message.id !== tempId)
  }))
}))