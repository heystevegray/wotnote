import { ClassName } from "@/lib/types"
import { cn } from "@/lib/utils"

const Gradient = ({ className }: ClassName) => {
  return (
    <div
      className={cn(
        "animate-gradient-pulse absolute left-0 top-0 z-0 size-full",
        className
      )}
    />
  )
}

export default Gradient
