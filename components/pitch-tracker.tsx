import AudioVisualizer from "@/components/audio-visualizer"

// import ChordDetection from "./chord-detection"
import Container from "./container"

const PitchTracker = () => {
  return (
    <Container className="flex flex-col items-center justify-center space-y-4">
      <AudioVisualizer />
      {/* <div className="h-[500px] w-full">
        <ChordDetection />
      </div> */}
    </Container>
  )
}

export default PitchTracker
