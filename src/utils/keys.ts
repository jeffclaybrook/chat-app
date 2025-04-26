export function saveSecretKey(secretKey: string) {
 localStorage.setItem("secretKey", secretKey)
}

export function getSecretKey() {
 if (typeof window === "undefined") return null
 const key = localStorage.getItem("secretKey")
 return key || null
}