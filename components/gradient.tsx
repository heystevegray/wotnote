import { ClassName } from "@/lib/types"
import { cn } from "@/lib/utils"

const Gradient = ({ className }: ClassName) => {
  return (
    <div
      className={cn(
        "absolute left-0 top-0 z-0 size-full animate-gradient-pulse",
        className
      )}
    />
  )
}

export default Gradient
