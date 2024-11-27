import Link from "next/link"

import HeaderText from "@/components/header-text"

const NotFound = () => {
  return (
    <div className="flex items-center justify-center">
      <HeaderText
        title="Ooof."
        description="Page Not Found. You may have hit a wrong note."
      >
        <Link href="/" className="underline">
          Return Home
        </Link>
      </HeaderText>
    </div>
  )
}

export default NotFound
