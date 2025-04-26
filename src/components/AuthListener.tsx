"use client"

import { useEffect } from "react"
import { useAuth } from "@clerk/nextjs"
import { deleteSecretKey } from "@/utils/keys"

export default function AuthListener() {
 const { isSignedIn, isLoaded } = useAuth()

 useEffect(() => {
  if (!isLoaded) return

  if (!isSignedIn) {
   deleteSecretKey().then(() => {
    console.log("Secret key deleted after sign-out.")
   }).catch((error) => {
    console.error("[SECRET_KEY_DELETE_ERROR]", error)
   })
  }
 }, [isSignedIn, isLoaded])

 return null
}