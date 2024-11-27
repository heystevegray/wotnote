import { ClassName } from "@/lib/types"
import { cn } from "@/lib/utils"

const Gradient = ({ className }: ClassName) => {
  return (
    <div
      className={cn(
        "absolute bg-gradient-to-r from-chord-1 to-chord-2 w-full h-full rounded-3xl blur-3xl animate-ai-spin z-0 origin-center top-0 left-0",
        className
      )}
    />
  )
}

export default Gradient
