import { ReactNode } from "react"

const Detail = ({
  label,
  value,
}: {
  label: string
  value?: string | number | ReactNode | null
}) => {
  if (!value) {
    return null
  }

  return (
    <p className="text-muted-foreground">
      {label}: <span className="text-foreground">{value}</span>
    </p>
  )
}

export default Detail
