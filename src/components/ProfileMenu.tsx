"use client"

import { UserButton } from "@clerk/nextjs"

export default function ProfileMenu() {
 return (
  <div className="flex items-center justify-end">
   <UserButton
    appearance={{
     elements: {
      userButtonAvatarBox: "h-12 w-12"
     }
    }}
   />
  </div>
 )
}