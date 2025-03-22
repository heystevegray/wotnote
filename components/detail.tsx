import { ReactNode } from "react"

import { UNAVAILABLE } from "@/lib/config"

const Detail = ({ label, value }: { label: string; value?: ReactNode }) => {
  if (!value) {
    return null
  }

  let body = value
  const isObject = typeof value === "object" && value !== null
  const isArray = Array.isArray(value)

  if (isObject) {
    body = (
      <pre className="overflow-x-auto whitespace-pre-wrap">
        {JSON.stringify(value, null, 2) ?? UNAVAILABLE}
      </pre>
    )
  }

  if (isArray) {
    body = value.join(", ") || UNAVAILABLE
  }

  return (
    <p className="text-muted-foreground">
      {label}: <span className="text-foreground">{body}</span>
    </p>
  )
}

export default Detail
