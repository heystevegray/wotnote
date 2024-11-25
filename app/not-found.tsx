import Link from "next/link"

import EmptyScreen from "@/components/empty-screen"

const NotFound = () => {
  return (
    <div className="flex items-center justify-center">
      <EmptyScreen
        title="Ooof."
        description="Page Not Found. You may have hit a wrong note."
      >
        <Link href="/" className="underline">
          Return Home
        </Link>
      </EmptyScreen>
    </div>
  )
}

export default NotFound
