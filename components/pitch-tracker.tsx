import AudioVisualizer from "@/lib/components/audio-visualizer"

import Container from "./container"

const PitchTracker = () => {
  return (
    <Container className="flex flex-col items-center justify-center space-y-4">
      <AudioVisualizer />
    </Container>
  )
}

export default PitchTracker
