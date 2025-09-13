import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TileSelection from "./components/TileSelection";
import TileRoom from "./components/tileRoom";
import TileVisualizerPage from "./pages/tile-visualizer/page";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<TileVisualizerPage />} />
          <Route path="/tileRoom" element={<TileRoom />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
