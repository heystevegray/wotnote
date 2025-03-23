import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    label?: string
    unit?: string
    displayValue?: string | number
    description?: string
  }
>(
  (
    {
      className,
      label = "",
      unit = "",
      description = "",
      displayValue,
      ...props
    },
    ref
  ) => {
    let value: string | number =
      props?.value?.[0] ?? props?.defaultValue?.[0] ?? 0

    value = displayValue ?? value

    return (
      <div className="space-y-4">
        {label ? (
          <p className="w-full text-foreground">
            {label}: {value ?? ""} {unit ?? ""}
          </p>
        ) : null}
        <SliderPrimitive.Root
          ref={ref}
          className={cn(
            "relative flex w-full touch-none select-none items-center",
            className
          )}
          {...props}
        >
          <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
            <SliderPrimitive.Range className="absolute h-full bg-primary" />
          </SliderPrimitive.Track>
          <SliderPrimitive.Thumb className="block size-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
        </SliderPrimitive.Root>
        {description ? (
          <p className="w-full text-muted-foreground">{description}</p>
        ) : null}
      </div>
    )
  }
)

Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
