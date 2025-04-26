/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useRef, useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { useRealTimeMessages } from "@/hooks/useRealTimeMessages"
import { useTypingListener } from "@/hooks/useTypingListener"
import { useChatStore } from "@/store/useChatStore"
import { useTypingStore } from "@/store/useTypingStore"
import { cn } from "@/lib/utils"
import MessageInput from "./MessageInput"

type ChatBoxProps = {
  currentUserId: string
  recipientId: string
  recipientName: string
  recipientPublicKey: string
  senderSecretKey: string
}

type GroupedMessages = {
  senderId: string
  senderName: string
  messages: {
    id: string
    text: string
    createdAt: string
    pending?: boolean
  }[]
}

function groupMessages(messages: any[], users: Record<string, string>): GroupedMessages[] {
  const groups: GroupedMessages[] = []
  let currentGroup: GroupedMessages | null = null

  for (const message of messages) {
    if (!currentGroup || currentGroup.senderId !== message.senderId) {
      if (currentGroup) groups.push(currentGroup)
      currentGroup = {
        senderId: message.senderId,
        senderName: users[message.senderId] || "Unknown",
        messages: []
      }
    }

    currentGroup.messages.push({
      id: message.id,
      text: message.text!,
      createdAt: message.createdAt,
      pending: message.pending
    })
  }

  if (currentGroup) groups.push(currentGroup)
  return groups
}

export default function ChatBox({
  currentUserId,
  recipientId,
  recipientName,
  recipientPublicKey,
  senderSecretKey
}: ChatBoxProps) {
  const messages = useChatStore((state) => state.messages)
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const typingUsers = useTypingStore((state) => state.typingUsers)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const groupedMessages = groupMessages(messages, {
    [currentUserId]: "You",
    [recipientId]: recipientName
  })
  const [showScrollButton, setShowScrollButton] = useState<boolean>(false)

  useRealTimeMessages({ currentUserId, secretKey: senderSecretKey })
  useTypingListener(currentUserId)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    const container = chatContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      if (scrollHeight - scrollTop - clientHeight > 100) {
        setShowScrollButton(true)
      } else {
        setShowScrollButton(false)
      }
    }

    container.addEventListener("scroll", handleScroll)
    return () => container.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="flex flex-col">
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-2 sm:space-y-4 relative">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400 text-cener mt-20">No messages yet. Start the conversation!</div>
        ) : (
          groupedMessages.map((group) => (
            <div key={group.senderId} className="space-y-1">
              <p className="text-gray-500 text-xs text-center sm:text-start">{group.senderName}</p>
              <AnimatePresence>
                {group.messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className={cn(
                      "max-w-[80%] sm:max-w-md px-4 py-2 rounded-lg text-sm break-words",
                      group.senderId === currentUserId
                        ? "ml-auto bg-sky-500 text-white"
                        : "mr-auto bg-gray-200 dark:bg-gray-800 text-black dark:text-white",
                      message.pending && "opacity-70 animate-pulse"
                    )}
                  >
                    <p>{message.text}</p>
                    {message.pending ? (
                      <p className="text-gray-400 text-xs text-end mt-1 animate-pulse">Sending...</p>
                    ) : (
                      <p className="text-gray-400 text-xs text-end mt-1">
                        {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                      </p>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ))
        )}
        <AnimatePresence>
          {typingUsers[recipientId] && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-gray-400 text-sm italic dark:text-gray-400"
            >
              {recipientName} is typing...
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showScrollButton && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                bottomRef.current?.scrollIntoView({ behavior: "smooth" })
              }}
              className="absolute bottom-24 right-4 bg-sky-500 text-white p-2 rounded-full shadow-md hover:bg-sky-600 transition"
            >
              <ChevronDown className="h-5 w-5" />
            </motion.button>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>
      <MessageInput
        currentUserId={currentUserId}
        recipientId={recipientId}
        recipientPublicKey={recipientPublicKey}
        senderSecretKey={senderSecretKey}
      />
    </div>
  )
}