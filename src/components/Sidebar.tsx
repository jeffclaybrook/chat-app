"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { useConversationStore } from "@/store/useConversationStore"
import { Button } from "./ui/button"
import ProfileMenu from "./ProfileMenu"

export default function Sidebar() {
  const { conversations, selectConversation, selectedConversation } = useConversationStore()
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)

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