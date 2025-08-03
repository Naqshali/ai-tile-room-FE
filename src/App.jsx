import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TileSelection from "./components/TileSelection";
import TileRoom from "./components/tileRoom";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<TileSelection />} />
          <Route path="/tileRoom" element={<TileRoom />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
