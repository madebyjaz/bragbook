import { useState } from "react";
import ZoomWrapper from "./components/ZoomWrapper";
import Hero from "./components/Hero";

function App() {
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <ZoomWrapper isZoomed={isZoomed}>
      <Hero
        onZoomIn={() => setIsZoomed(true)}
        onZoomOut={() => setIsZoomed(false)}
      />
    </ZoomWrapper>
  );
}

export default App;

