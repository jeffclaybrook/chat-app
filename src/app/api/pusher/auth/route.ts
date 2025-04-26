import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { pusherServer } from "@/lib/pusher"

export async function POST(req: Request) {
 try {
  const { userId } = await auth()

  if (!userId) {
   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { socket_id, channel_name } = body

  const authResponse = pusherServer.authorizeChannel(socket_id, channel_name, {
   user_id: userId
  })

  return NextResponse.json(authResponse)
 } catch (error) {
  console.error("[PUSHER_AUTH_ERROR]", error)
  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
 }
}