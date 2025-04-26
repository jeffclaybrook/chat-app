"use server"

import { auth } from "@clerk/nextjs/server"
import prisma from "../prisma"

export async function savePublicKey(publicKey: string) {
 const { userId } = await auth()

 if (!userId) {
  throw new Error("Unauthorized")
 }

 await prisma.user.update({
  where: { id: userId },
  data: { publicKey }
 })
}