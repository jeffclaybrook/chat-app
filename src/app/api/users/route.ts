import { NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
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

export async function POST() {
 try {
  const { userId } = await auth()
  const user = await currentUser()

  if (!userId || !user) {
   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const existing = await prisma.user.findUnique({
   where: { id: userId }
  })

  if (!existing) {
   await prisma.user.create({
    data: {
     id: userId,
     email: user.emailAddresses[0].emailAddress,
     publicKey: ""
    }
   })
  }

  return NextResponse.json({ success: true })
 } catch (error) {
  console.error("[USERS_POST_ERROR]", error)
  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
 }
}

export async function PATCH(req: Request) {
 try {
  const { userId } = await auth()

  if (!userId) {
   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { publicKey } = await req.json()

  if (!publicKey) {
   return NextResponse.json({ error: "Missing publicKey" }, { status: 400 })
  }

  await prisma.user.update({
   where: { id: userId },
   data: { publicKey }
  })

  return NextResponse.json({ success: true })
 } catch (error) {
  console.error("[USERS_PATCH_ERROR]", error)
  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
 }
}