"use client"

import { useEffect } from "react"
import { redirect } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import { useConversationStore } from "@/store/useConversationStore"
import { getSecretKey } from "@/utils/keys"
import { useKeyStore } from "@/store/useKeyStore"
import ChatBox from "@/components/ChatBox"
import KeyManager from "@/components/KeyManager"
import Sidebar from "@/components/Sidebar"

export default function Chat() {
 const { userId } = useAuth()
 const { selectedConversation } = useConversationStore()
 const { keysLoading } = useKeyStore()
 const senderSecretKey = getSecretKey()
 const setConversations = useConversationStore((s) => s.setConversations)

 useEffect(() => {
  async function fetchConvos() {
   const res = await fetch("/api/conversations")
   const data = await res.json()
   setConversations(data)
  }
  fetchConvos()
 }, [setConversations])

 if (!userId) {
  return redirect("/sign-in")
 }

 return (
  <div className="flex h-screen">
   <KeyManager />
   {keysLoading || !senderSecretKey ? (
    <div className="flex items-center justify-center flex-1">
     <div className="text-gray-400 text-lg animate-pulse">Loading encryption keys...</div>
    </div>
   ) : (
    <>
     <div className="flex flex-1 overflow-hidden">
      <Sidebar />
      <main className="flex flex-col flex-1">
       {selectedConversation ? (
        <ChatBox
         currentUserId={userId}
         recipientId={selectedConversation.userId}
         recipientName={selectedConversation.userName}
         recipientPublicKey={selectedConversation.userPublicKey}
         senderSecretKey={senderSecretKey}
        />
       ) : (
        <div className="flex items-center justify-center flex-1 text-gray-500">
         Select a conversation to start chatting!
        </div>
       )}
      </main>
     </div>
    </>
   )}
  </div>
 )
}