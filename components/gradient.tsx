import { ClassName } from "@/lib/types"
import { cn } from "@/lib/utils"

const Gradient = ({ className }: ClassName) => {
  return (
    <div
      className={cn(
        "absolute left-0 top-0 z-0 size-full origin-center animate-ai-spin rounded-3xl bg-gradient-to-r from-chord-1 to-chord-2 blur-3xl",
        className
      )}
    />
  )
}

export default Gradient
