"use client"

import { useEffect, useState } from "react"
import { redirect } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import { useConversationStore } from "@/store/useConversationStore"
import { ensureSecretKeyExists } from "@/utils/keys"
import { useKeyStore } from "@/store/useKeyStore"
import ChatBox from "@/components/ChatBox"
import CreateChat from "@/components/CreateChat"
import KeyManager from "@/components/KeyManager"
import Sidebar from "@/components/Sidebar"

export default function Chat() {
 const { userId, isLoaded } = useAuth()
 const { selectedConversation } = useConversationStore()
 const { keysLoading } = useKeyStore()
 const [senderSecretKey, setSenderSecretKey] = useState<string | null>(null)
 const setConversations = useConversationStore((s) => s.setConversations)

 useEffect(() => {
  if (!isLoaded || !userId) return

  async function ensureKeys() {
   const key = await ensureSecretKeyExists()
   setSenderSecretKey(key)
  }

  ensureKeys()
 }, [isLoaded, userId])

 useEffect(() => {
  async function ensureUserInDatabase() {
   if (!isLoaded || !userId) return

   try {
    await fetch("/api/users", {
     method: "POST"
    })
   } catch (error) {
    console.error("[ENSURE_USER_IN_DB_ERROR]", error)
   }
  }

  ensureUserInDatabase()
 }, [isLoaded, userId])

 useEffect(() => {
  if (isLoaded && userId) {
   async function fetchConvos() {
    const res = await fetch("/api/conversations")
    const data = await res.json()
    setConversations(data)
   }
   fetchConvos()
  }
 }, [isLoaded, userId, setConversations])

 if (!isLoaded) {
  return (
   <div className="flex items-center justify-center flex-1 h-screen">
    <p className="text-gray-400 text-lg animate-pulse">Loading authentication...</p>
   </div>
  )
 }

 if (!userId) {
  return redirect("/sign-in")
 }

 return (
  <div className="flex h-screen">
   <KeyManager />
   {keysLoading || senderSecretKey === null ? (
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
         recipientId={selectedConversation.id}
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
   <CreateChat />
  </div>
 )
}