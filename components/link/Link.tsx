import Link from "next/link"
import { Link as MUILink } from "@material-ui/core"

type Props = {
  href: string
  as?: string
  label: string
  color?:
    | "inherit"
    | "initial"
    | "primary"
    | "secondary"
    | "textPrimary"
    | "textSecondary"
    | "error"
    | undefined
}

export default function CustomLink({
  href,
  as,
  label,
  color = "inherit",
}: Props) {
  return (
    <Link passHref href={href} as={as}>
      <MUILink color={color}>{label}</MUILink>
    </Link>
  )
}
