/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect } from "react"
import { pusherClient } from "@/lib/pusher"
import { useChatStore } from "@/store/useChatStore"
import { decryptMessage } from "@/lib/encryption"

type Props = {
 currentUserId: string
 secretKey: string
}

export function useRealTimeMessages({ currentUserId, secretKey }: Props) {
 const { addMessage, removePendingMessage } = useChatStore()

 useEffect(() => {
  if (!currentUserId || !secretKey) return

  const channel = pusherClient.subscribe(`private-chat-${currentUserId}`)

  channel.bind("new-message", (data: any) => {
   if (data.tempId) {
    removePendingMessage(data.tempId)
   }

   addMessage({
    id: data.id,
    senderId: data.senderId,
    receiverId: data.receiverId,
    ciphertext: data.ciphertext,
    nonce: data.nonce,
    createdAt: data.createdAt,
    text: decryptMessage({
     ciphertext: data.ciphertext,
     nonce: data.nonce,
     secretKey
    }) || "",
    pending: false
   })
  })

  return () => {
   pusherClient.unsubscribe(`private-chat-${currentUserId}`)
  }
 }, [currentUserId, secretKey, addMessage, removePendingMessage])
}