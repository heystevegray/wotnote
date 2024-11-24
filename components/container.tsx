import { PropsWithChildren } from "react"

import { cn } from "@/lib/utils"

const Container = ({
  children,
  className,
}: { className?: string } & PropsWithChildren) => {
  return (
    <div className={cn("mx-auto lg:max-w-6xl p-2 md:p-4 w-full", className)}>
      {children}
    </div>
  )
}

export default Container
