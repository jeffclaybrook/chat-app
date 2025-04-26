import { create } from "zustand"

type Conversation = {
 id: string
 userName: string
 userPublicKey: string
 createdAt: string
}

type User = {
 id: string
 userName: string
 userPublicKey: string
}

type ConversationStore = {
 conversations: Conversation[]
 selectedConversation: Conversation | null
 setConversations: (conversations: Conversation[]) => void
 selectConversation: (conversation: Conversation) => void
 startNewConversation: (user: User) => Promise<void>
}

export const useConversationStore = create<ConversationStore>((set) => ({
 conversations: [],
 selectedConversation: null,
 setConversations: (conversations) => set({ conversations }),
 selectConversation: (conversation) => set({ selectedConversation: conversation }),
 startNewConversation: async (user) => {
  try {
   const res = await fetch("/api/conversations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
     userName: user.userName,
     userPublicKey: user.userPublicKey
    })
   })

   if (!res.ok) {
    throw new Error("Unable to create conversation")
   }

   const newConversation = await res.json()

   set((state) => ({
    conversations: [newConversation, ...state.conversations],
    selectedConversation: newConversation
   }))
  } catch (error) {
   console.error("[START_NEW_CONVERSATION_ERROR]", error)
  }
 }
}))