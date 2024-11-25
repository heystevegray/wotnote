import { useEffect } from "react"
import { useSearchParams } from "next/navigation"

import { urlParams } from "@/lib/config"
import { MAX_KEY, MIN_KEY, Note } from "@/lib/core/Piano"
import { ClassName } from "@/lib/types"

type Props = {
  activeNotes?: Note[]
  chordIndex: number
  height?: number
  octaves?: 1 | 2 | 3 | 4 | 5 | 6 | 7
} & ClassName

const SVG_WIDTH = 362
const SVG_HEIGHT = 325
const pixelGap = 2

const Octave = () => {
  return (
    <g transform="matrix(1,0,0,1,-902,-840)" className="fill-key">
      <g id="C" transform="matrix(0.621295,0,0,0.621295,901.699,839.743)">
        <path d="M0.485,0.414L0.485,518.686L8.533,523.515L74.524,523.515L80.962,518.686L80.962,346.465L53.6,346.465L53.6,0.414L0.485,0.414Z" />
      </g>
      <g
        id="Db"
        transform="matrix(0.586854,0,0,0.637027,894.746,836.748)"
        className="fill-key-dark"
      >
        <rect x="72" y="5.104" width="54.528" height="334.366" />
      </g>
      <g id="D" transform="matrix(0.622587,0,0,0.621295,797.66,839.209)">
        <path d="M278.418,1.274L278.418,347.325L251.113,347.325L251.113,519.546L257.537,524.375L324.998,524.375L331.423,519.546L331.423,347.325L304.117,347.325L304.117,1.274L278.418,1.274Z" />
      </g>
      <g
        id="Eb"
        transform="matrix(0.586854,0,0,0.637076,946.746,836.748)"
        className="fill-key-dark"
      >
        <rect x="72" y="5.104" width="54.528" height="334.34" />
      </g>
      <g id="E" transform="matrix(-0.621295,0,0,0.62236,1056.46,839.743)">
        <path d="M0.74,0.414L0.698,517.799L7.179,522.62L74.779,522.62L81.217,517.799L81.175,345.873L53.855,345.873L53.855,0.414L0.74,0.414Z" />
      </g>
      <g id="F" transform="matrix(0.621295,0,0,0.621295,1057.7,839.743)">
        <path d="M0.485,0.414L0.527,518.686L8.533,523.515L74.524,523.515L80.962,518.686L80.962,346.465L53.6,346.465L53.6,0.414L0.485,0.414Z" />
      </g>
      <g
        id="Gb"
        transform="matrix(0.586854,0,0,0.637027,1050.75,836.748)"
        className="fill-key-dark"
      >
        <rect x="72" y="5.104" width="54.528" height="334.366" />
      </g>
      <g id="G" transform="matrix(0.622587,0,0,0.621295,953.66,839.209)">
        <path d="M278.418,1.274L278.418,347.325L251.113,347.325L251.113,519.546L257.537,524.375L324.998,524.375L331.423,519.546L331.423,347.325L304.117,347.325L304.117,1.274L278.418,1.274Z" />
      </g>
      <g
        id="Ab"
        transform="matrix(0.586854,0,0,0.637027,1102.75,836.748)"
        className="fill-key-dark"
      >
        <rect x="72" y="5.104" width="54.528" height="334.366" />
      </g>
      <g id="A" transform="matrix(0.622587,0,0,0.621295,1005.63,839.209)">
        <path d="M278.418,1.274L278.418,347.325L251.113,347.325L251.113,519.546L257.537,524.375L324.998,524.375L331.423,519.546L331.423,347.325L304.117,347.325L304.117,1.274L278.418,1.274Z" />
      </g>
      <g
        id="Bb"
        transform="matrix(0.586854,0,0,0.637027,1154.75,836.748)"
        className="fill-key-dark"
      >
        <rect x="72" y="5.104" width="54.528" height="334.366" />
      </g>
      <g id="B" transform="matrix(-0.621295,0,0,0.62236,1264.43,839.743)">
        <path d="M0.74,0.414L0.698,517.799L7.179,522.62L74.779,522.62L81.217,517.799L81.175,345.873L53.855,345.873L53.855,0.414L0.74,0.414Z" />
      </g>
    </g>
  )
}

const getOctaves = (octaves = 1) => {
  const keys = []

  for (let i = 0; i < octaves; i++) {
    const translateX = i > 0 ? i * (SVG_WIDTH + pixelGap) : 0
    keys.push(
      <g key={i} transform={`translate(${translateX}, 0)`}>
        <Octave />
      </g>
    )
  }

  return <g>{keys}</g>
}

const PianoRoll = ({ activeNotes, chordIndex, octaves = 1 }: Props) => {
  const searchParams = useSearchParams()

  const color =
    (searchParams.get(urlParams.color) as string) ?? "hsl(var(--primary))"

  const getKeyByCode = (code: number) => {
    return document.getElementsByClassName(`${code}`)[chordIndex] as HTMLElement
  }

  const resetKeys = () => {
    // Reset all keys
    for (let index = MIN_KEY; index < MAX_KEY; index++) {
      const key = getKeyByCode(index)
      if (key) {
        key.style.fill = ""
      }
    }
  }

  const highlightKeys = () => {
    activeNotes?.map((note) => {
      const key = getKeyByCode(note.code)

      if (key) {
        key.style.fill = color
      }
    })
  }

  useEffect(() => {
    resetKeys()
    highlightKeys()
  }, [activeNotes])

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${SVG_WIDTH * octaves} ${SVG_HEIGHT}`}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      {getOctaves(octaves)}
    </svg>
  )
}

export default PianoRoll
