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
        className={cn("flex w-full items-center justify-center", className)}
      >
        <div className="flex flex-col space-y-4 text-center">
          <div className="flex w-full justify-center">
            <Icons.logo className="size-6" />
          </div>
          <h2 className="m-0 flex flex-col items-center justify-center bg-clip-text p-0 text-3xl">
            {title ?? null}
          </h2>
          {description ? (
            <p className="text-lg leading-normal text-muted-foreground">
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
