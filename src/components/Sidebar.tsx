/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import { Menu, Plus, X } from "lucide-react"
import { useConversationStore } from "@/store/useConversationStore"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import ProfileMenu from "./ProfileMenu"

type User = {
  id: string
  email: string
  publicKey: string
}

export default function Sidebar() {
  const { conversations, selectConversation, selectedConversation, startNewConversation } = useConversationStore()
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [openNewChat, setOpenNewChat] = useState<boolean>(false)
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)

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
    <>
      <nav className="absolute top-0 left-0 w-full flex items-center p-4 z-30">
        <Button
          variant="ghost"
          onClick={() => setSidebarOpen(true)}
          className="md:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </nav>
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 overflow-y-auto bg-white dark:bg-gray-900 border-r transform transition-transform duration-300 ease-in-out p-4 md:relative md:translate-x-0 md:flex md:flex-col ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between gap-4 mb-4">
          <ProfileMenu />
          <span className="font-bold text-lg flex-1">Chats</span>
          <Button
            variant="ghost"
            onClick={() => setSidebarOpen(false)}
            className="md:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <Dialog open={openNewChat} onOpenChange={setOpenNewChat}>
          <DialogTrigger asChild>
            <Button className="w-full">
              <Plus />
              Start New Chat
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
        <ul className="space-y-2 px-2">
          {conversations.map((conversation) => (
            <li key={conversation.id}>
              <Button
                onClick={() => selectConversation(conversation)}
                className={`w-full text-start px-4 py-2 rounded ${selectedConversation?.id === conversation.id
                    ? "bg-sky-500 text-white"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
              >
                {conversation.userName}
              </Button>
            </li>
          ))}
        </ul>
      </aside>
    </>
  )
}