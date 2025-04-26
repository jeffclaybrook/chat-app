import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import Pusher from "pusher"
import prisma from "@/lib/prisma"

const pusher = new Pusher({
 appId: process.env.PUSHER_APP_ID!,
 key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
 secret: process.env.PUSHER_SECRET!,
 cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
 useTLS: true
})

export async function GET() {
 return NextResponse.json({ message: "Messages endpoint: POST only" })
}

export async function POST(req: Request) {
 const { userId } = await auth()

 if (!userId) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
 }

 const body = await req.json()
 const { toUserId, ciphertext, nonce } = body

 const message = await prisma.message.create({
  data: {
   senderId: userId,
   receiverId: toUserId,
   ciphertext,
   nonce
  }
 })

 await pusher.trigger(`private-chat-${toUserId}`, "new-message", {
  ...message
 })

 return NextResponse.json(message)
}