import { useEffect } from "react"
import { useTypingStore } from "@/store/useTypingStore"
import { pusherClient } from "@/lib/pusher"

export function useTypingListener(currentUserId: string) {
 const setTyping = useTypingStore((s) => s.setTyping)

 useEffect(() => {
  const channel = pusherClient.subscribe(`private-chat-${currentUserId}`)

  channel.bind("typing-start", ({ userId }: { userId: string }) => {
   setTyping(userId, true)
  })

  channel.bind("typing-stop", ({ userId }: { userId: string }) => {
   setTyping(userId, false)
  })

  return () => {
   pusherClient.unsubscribe(`private-chat-${currentUserId}`)
  }
 }, [currentUserId, setTyping])
}