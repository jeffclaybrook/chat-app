"use client"

import nacl from "tweetnacl"
import * as naclUtil from "tweetnacl-util"
import { get, set, del } from "idb-keyval"

const SECRET_KEY_STORAGE_KEY = "secretKey"

export async function saveSecretKey(secretKey: string) {
 if (typeof window === "undefined") return
 await set(SECRET_KEY_STORAGE_KEY, secretKey)
}

export async function getSecretKey(): Promise<string | null> {
 if (typeof window === undefined) return null
 const key = await get<string>(SECRET_KEY_STORAGE_KEY)
 return key || null
}

export function generateKeyPair() {
 const keyPair = nacl.box.keyPair()
 return {
  publicKey: naclUtil.encodeBase64(keyPair.publicKey),
  secretKey: naclUtil.encodeBase64(keyPair.secretKey)
 }
}

export async function generateAndSaveKeypair() {
 const keyPair = nacl.box.keyPair()
 const secretKey = naclUtil.encodeBase64(keyPair.secretKey)
 const publicKey = naclUtil.encodeBase64(keyPair.publicKey)

 await saveSecretKey(secretKey)

 return { publicKey, secretKey }
}

export async function ensureSecretKeyExists(): Promise<string> {
 let secretKey = await getSecretKey()

 if (!secretKey) {
  const generated = await generateAndSaveKeypair()
  secretKey = generated.secretKey

  try {
   await fetch("/api/users", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ publicKey: generated.publicKey })
   })
  } catch (error) {
   console.error("[ENSURE_SECRET_KEY_SYNC_ERROR]", error)
  }
 }

 return secretKey
}

export async function deleteSecretKey() {
 if (typeof window === "undefined") return
 await del(SECRET_KEY_STORAGE_KEY)
}