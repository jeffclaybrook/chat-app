import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"

export async function GET() {
 try {
  const { userId } = await auth()

  if (!userId) {
   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const conversations = await prisma.conversation.findMany({
   where: {
    userId: userId
   },
   orderBy: {
    createdAt: "desc"
   },
   select: {
    id: true,
    userName: true,
    userPublicKey: true,
    createdAt: true
   }
  })

  return NextResponse.json(conversations)
 } catch (error) {
  console.error("[CONVERSATIONS_GET_ERROR]", error)
  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
 }
}

export async function POST(req: Request) {
 try {
  const { userId } = await auth()

  if (!userId) {
   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { userName, userPublicKey } = body

  if (!userName || !userPublicKey) {
   return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  const conversation = await prisma.conversation.create({
   data: {
    userId,
    userName,
    userPublicKey
   }
  })

  return NextResponse.json(conversation)
 } catch (error) {
  console.error("[CONVERSATIONS_POST_ERROR]", error)
  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
 }
}