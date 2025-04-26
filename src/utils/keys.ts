export function saveSecretKey(secretKey: string) {
 localStorage.setItem("secretKey", secretKey)
}

export function getSecretKey(): string | null {
 return localStorage.getItem("secretKey")
}