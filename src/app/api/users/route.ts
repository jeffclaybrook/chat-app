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
   NOT: {
    id: userId
   }
  },
  select: {
   id: true,
   publicKey: true,
   email: true
  },
  orderBy: {
   email: "asc"
  }
 })

 return NextResponse.json(users)
}