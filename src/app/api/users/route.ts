import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"

export async function GET() {
 const { userId } = await auth()

 if (!userId) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
 }

 const users = await prisma.user.findMany({
  where: {
   id: {
    not: userId
   }
  },
  select: {
   id: true,
   email: true,
   publicKey: true
  },
  orderBy: {
   email: "asc"
  }
 })

 const formatted = users.map((user) => ({
  id: user.id,
  userId: user.id,
  userName: user.email,
  userPublicKey: user.publicKey
 }))

 return NextResponse.json(formatted)
}