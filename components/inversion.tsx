import React from "react"

import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group"

const Inversion = ({
  value,
}: {
  value?: "root" | "first" | "second" | "third"
}) => {
  return (
    <ToggleGroup type="single" value={value} size="sm">
      <ToggleGroupItem value="root">root</ToggleGroupItem>
      <ToggleGroupItem value="first">1st</ToggleGroupItem>
      <ToggleGroupItem value="second">2nd</ToggleGroupItem>
      <ToggleGroupItem value="third">3rd</ToggleGroupItem>
    </ToggleGroup>
  )
}

export default Inversion
