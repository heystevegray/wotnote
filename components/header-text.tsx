import { PropsWithChildren } from "react"

import { ClassName } from "@/lib/types"
import { cn } from "@/lib/utils"

import Container from "./container"
import { Icons } from "./icons"

export type EmptyScreenProps = {
  title?: string
  description?: string
} & ClassName &
  PropsWithChildren

const HeaderText = ({
  title,
  description,
  children = null,
  className,
}: EmptyScreenProps) => {
  return (
    <div className="pt-12">
      <Container
        className={cn("flex items-center w-full justify-center", className)}
      >
        <div className="flex flex-col text-center space-y-4">
          <div className="w-full flex justify-center">
            <Icons.logo className="size-6" />
          </div>
          <h2 className="text-3xl bg-clip-text flex flex-col justify-center items-center m-0 p-0">
            {title ?? null}
          </h2>
          {description ? (
            <p className="leading-normal text-muted-foreground text-lg">
              {description}
            </p>
          ) : null}
          {children}
        </div>
      </Container>
    </div>
  )
}

export default HeaderText
