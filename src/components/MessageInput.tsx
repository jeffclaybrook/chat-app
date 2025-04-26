"use client"

import { FormEvent, useEffect, useRef, useState } from "react"
import { encryptMessage } from "@/lib/encryption"
import { useChatStore } from "@/store/useChatStore"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

type MessageInputProps = {
 currentUserId: string
 recipientId: string
 recipientPublicKey: string
 senderSecretKey: string
}

export default function MessageInput({
 currentUserId,
 recipientId,
 recipientPublicKey,
 senderSecretKey
}: MessageInputProps) {
 const [text, setText] = useState<string>("")
 const [loading, setLoading] = useState<boolean>(false)
 const { addMessage } = useChatStore()

 const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

 useEffect(() => {
  if (!text) return

  fetch("/api/typing", {
   method: "POST",
   body: JSON.stringify({
    toUserId: recipientId,
    type: "start"
   })
  })

  if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)

  typingTimeoutRef.current = setTimeout(() => {
   fetch("/api/typing", {
    method: "POST",
    body: JSON.stringify({
     toUserId: recipientId,
     type: "stop"
    })
   })
  }, 2000)
 }, [text])

 const handleSendMessage = async (e: FormEvent) => {
  e.preventDefault()

  if (!text.trim()) return

  setLoading(true)

  try {
   const { ciphertext, nonce } = encryptMessage({
    message: text,
    recipientPublicKey,
    senderSecretKey
   })

   const tempId = "temp-" + Date.now()

   addMessage({
    id: tempId,
    senderId: currentUserId,
    receiverId: recipientId,
    ciphertext,
    nonce,
    createdAt: new Date().toISOString(),
    text,
    pending: true
   })

   await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
     toUserId: recipientId,
     ciphertext,
     nonce,
     tempId
    })
   })

   setText("")
  } catch (error) {
   console.error("Unable to send message", error)
  } finally {
   setLoading(false)
  }
 }

 return (
  <form onSubmit={handleSendMessage} className="flex gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
   <Input
    type="text"
    placeholder="Type your message..."
    value={text}
    onChange={e => setText(e.target.value)}
    disabled={loading}
    className="flex-1"
   />
   <Button type="submit" disabled={loading || !text.trim()}>
    {loading ? "Sending..." : "Send"}
   </Button>
  </form>
 )
}