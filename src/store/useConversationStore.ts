import { create } from "zustand"

type Conversation = {
 id: string
 userId: string
 userName: string
 userPublicKey: string
}

type ConversationStore = {
 conversations: Conversation[]
 selectedConversation: Conversation | null
 setConversations: (convos: Conversation[]) => void
 selectConversation: (convo: Conversation) => void
}

export const useConversationStore = create<ConversationStore>((set) => ({
 conversations: [],
 selectedConversation: null,
 setConversations: (conversations) => set({ conversations }),
 selectConversation: (conversation) => set({ selectedConversation: conversation })
}))