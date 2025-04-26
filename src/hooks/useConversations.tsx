/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"

type Conversation = {
 id: string
 userName: string
 userPublicKey: string
 createdAt: string
}

export function useConversations() {
 const [conversations, setConversations] = useState<Conversation[]>([])
 const [loading, setLoading] = useState<boolean>(true)
 const [error, setError] = useState<string | null>(null)

 useEffect(() => {
  fetchConversations()
 }, [])

 async function fetchConversations() {
  try {
   setLoading(true)

   const res = await fetch("/api/conversations")

   if (!res.ok) {
    throw new Error("Unable to fetch conversations")
   }

   const data = await res.json()
   setConversations(data)
  } catch (error: any) {
   console.error("[FETCH_CONVERSATIONS_ERROR]", error)
   setError(error.message || "Something went wrong")
  } finally {
   setLoading(false)
  }
 }

 async function createConversation(userName: string, userPublicKey: string) {
  try {
   const res = await fetch("/api/conversations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userName, userPublicKey })
   })

   if (!res.ok) {
    throw new Error("Unable to create conversation")
   }

   const newConversation = await res.json()
   setConversations((prev) => [newConversation, ...prev])
   return newConversation
  } catch (error: any) {
   console.error("[CREATE_CONVERSATION_ERROR]", error)
   setError(error.message || "Something went wrong")
   throw error
  }
 }

 return {
  conversations,
  loading,
  error,
  fetchConversations,
  createConversation
 }
}