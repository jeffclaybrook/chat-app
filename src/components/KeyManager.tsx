"use client"

import { useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { generateAndSaveKeypair } from "@/lib/encryption"
import { savePublicKey } from "@/lib/actions/user"
import { getSecretKey } from "@/utils/keys"
import { useKeyStore } from "@/store/useKeyStore"

export default function KeyManager() {
 const { user, isLoaded } = useUser()
 const setKeysLoading = useKeyStore((state) => state.setKeysLoading)

 useEffect(() => {
  async function setupKeys() {
   if (!isLoaded || !user) return

   const secretKey = getSecretKey()

   if (!secretKey) {
    const { publicKey } = generateAndSaveKeypair()
    await savePublicKey(publicKey)
    console.log("Generated new keypair and saved public key.")
   }

   setKeysLoading(false)
  }

  setupKeys()
 }, [isLoaded, user, setKeysLoading])

 return null
}