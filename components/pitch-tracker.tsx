import AudioVisualizer from "@/components/audio-visualizer"

import ChordDetection from "./chord-detection"
import Container from "./container"

const PitchTracker = () => {
  return (
    <Container className="flex flex-col items-center justify-center space-y-4">
      {/* <ChordDetection /> */}
      <AudioVisualizer />
    </Container>
  )
}

export default PitchTracker
