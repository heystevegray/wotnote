import { Suspense } from "react"

import Keyboard from "@/components/piano/keyboard"

export default function IndexPage() {
  return (
    <Suspense>
      <Keyboard />
    </Suspense>
  )
}
