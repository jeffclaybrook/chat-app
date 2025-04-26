import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import Pusher from "pusher"

const pusher = new Pusher({
 appId: process.env.PUSHER_APP_ID!,
 key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
 secret: process.env.PUSHER_SECRET!,
 cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
 useTLS: true
})

export async function POST(req: Request) {
 const { userId } = await auth()
 const { toUserId, type } = await req.json()

 if (!userId) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
 }

 const event = type === "start" ? "typing-start" : "typing-stop"

 await pusher.trigger(`private-chat-${toUserId}`, event, { userId })

 return NextResponse.json({ success: true })
}