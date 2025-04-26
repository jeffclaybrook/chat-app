import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
 return (
  <main className="flex items-center justify-center h-screen">
   <Button asChild>
    <Link href={"/chat"}>Go to Chat</Link>
   </Button>
  </main>
 )
}