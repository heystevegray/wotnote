import React from "react"

import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group"

const Inversion = ({
  value,
}: {
  value?: "root" | "first" | "second" | "third"
}) => {
  return (
    <ToggleGroup type="single" value={value} size="sm">
      <ToggleGroupItem disabled={value !== "root"} value="root">
        root
      </ToggleGroupItem>
      <ToggleGroupItem disabled={value !== "first"} value="first">
        1st
      </ToggleGroupItem>
      <ToggleGroupItem disabled={value !== "second"} value="second">
        2nd
      </ToggleGroupItem>
      <ToggleGroupItem disabled={value !== "third"} value="third">
        3rd
      </ToggleGroupItem>
    </ToggleGroup>
  )
}

export default Inversion
