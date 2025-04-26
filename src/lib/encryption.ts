import nacl from "tweetnacl"
import * as naclUtil from "tweetnacl-util"
import { saveSecretKey } from "@/utils/keys"

export function generateKeyPair() {
 const keyPair = nacl.box.keyPair()
 return {
  publicKey: naclUtil.encodeBase64(keyPair.publicKey),
  secretKey: naclUtil.encodeBase64(keyPair.secretKey)
 }
}

export function encryptMessage({
 message,
 recipientPublicKey,
 senderSecretKey
}: {
 message: string
 recipientPublicKey: string
 senderSecretKey: string
}) {
 const nonce = nacl.randomBytes(nacl.box.nonceLength)
 const encrypted = nacl.box(
  naclUtil.decodeUTF8(message),
  nonce,
  naclUtil.decodeBase64(recipientPublicKey),
  naclUtil.decodeBase64(senderSecretKey)
 )
 return {
  ciphertext: naclUtil.encodeBase64(encrypted),
  nonce: naclUtil.encodeBase64(nonce)
 }
}

export function decryptMessage({
 ciphertext,
 nonce,
 secretKey
}: {
 ciphertext: string
 nonce: string
 secretKey: string
}) {
 try {
  const cipherBytes = naclUtil.decodeBase64(ciphertext)
  const nonceBytes = naclUtil.decodeBase64(nonce)
  const secretKeyBytes = naclUtil.decodeBase64(secretKey)
  const messageBytes = nacl.secretbox.open(cipherBytes, nonceBytes, secretKeyBytes)

  if (!messageBytes) {
   return null
  }

  return naclUtil.encodeUTF8(messageBytes)
 } catch (error) {
  console.error("Decryption failed", error)
  return null
 }
}

export function generateAndSaveKeypair() {
 const keyPair = nacl.box.keyPair()
 const secretKey = naclUtil.encodeBase64(keyPair.secretKey)
 const publicKey = naclUtil.encodeBase64(keyPair.publicKey)

 saveSecretKey(secretKey)

 return { publicKey }
}