"use client"

import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { useConversationStore } from "@/store/useConversationStore"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"

type User = {
 id: string
 email: string
 publicKey: string
}

export default function CreateChat() {
 const { startNewConversation } = useConversationStore()
 const [allUsers, setAllUsers] = useState<User[]>([])
 const [openNewChat, setOpenNewChat] = useState<boolean>(false)

 useEffect(() => {
  async function fetchUsers() {
   try {
    const res = await fetch("/api/users")
    const data = await res.json()
    setAllUsers(data)
   } catch (error) {
    console.error("[FETCH_USERS_ERROR]", error)
   }
  }
  fetchUsers()
 }, [])

 return (
  <Dialog open={openNewChat} onOpenChange={setOpenNewChat}>
   <DialogTrigger asChild>
    <Button className="fixed bottom-6 right-6">
     <Plus />
     <span className="hidden lg:flex">Start New Chat</span>
    </Button>
   </DialogTrigger>
   <DialogContent className="max-w-md">
    <DialogHeader>
     <DialogTitle>Select a user to chat with</DialogTitle>
    </DialogHeader>
    <div className="mt-4 space-y-2">
     {allUsers.length > 0 ? (
      allUsers.map((user) => (
       <Button
        key={user.id}
        variant="ghost"
        onClick={async () => {
         await startNewConversation({
          id: user.id,
          userName: user.email,
          userPublicKey: user.publicKey
         })
         setOpenNewChat(false)
        }}
       >
        {user.email}
       </Button>
      ))
     ) : (
      <p className="text-gray-500 text-sm">No users found.</p>
     )}
    </div>
   </DialogContent>
  </Dialog>
 )
}