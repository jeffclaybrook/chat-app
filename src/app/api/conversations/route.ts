import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"

export async function GET() {
 const { userId } = await auth()

 if (!userId) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
 }

 const sentMessages = await prisma.message.findMany({
  where: { senderId: userId },
  select: { receiverId: true },
  distinct: ["receiverId"]
 })

 const receivedMessages = await prisma.message.findMany({
  where: { receiverId: userId },
  select: { senderId: true },
  distinct: ["senderId"]
 })

 const contactIds = new Set<string>()

 sentMessages.forEach((m) => contactIds.add(m.receiverId))
 receivedMessages.forEach((m) => contactIds.add(m.senderId))

 contactIds.delete(userId)

 const contacts = await prisma.user.findMany({
  where: {
   id: { in: Array.from(contactIds) }
  },
  select: {
   id: true,
   publicKey: true,
   email: true
  }
 })

 const formatted = contacts.map((user) => ({
  id: user.id,
  userId: user.id,
  userName: user.email,
  userPublicKey: user.publicKey
 }))

 return NextResponse.json(formatted)
}