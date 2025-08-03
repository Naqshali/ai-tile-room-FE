import { useState } from "react";
import mainStore from "../store/main";
import { useNavigate } from "react-router-dom";
import TileRoom from "./tileRoom";

const TileSelection = () => {
  const { setSelectedFloorTile, setSelectedWallTile } = mainStore();
  const navigate = useNavigate();
  const tileImages = ["/tiles/beige-marble.jpg", "/tiles/grey-slate.jpg"];
  const [selectedType, setSelectedType] = useState("floor");

  const onSelectTile = (src) => {
    if (selectedType === "floor") {
      setSelectedFloorTile(src);
    } else if (selectedType === "wall") {
      setSelectedWallTile(src);
    }
  };

  const onProceed = () => {
    navigate("/tileRoom");
  };

  return (
    <div className="flex w-screen h-screen">
      {/* Sidebar for Tile Selection */}
      <div className="bg-gray-100 p-4 overflow-y-auto border-r border-gray-200 w-full">
        <div className="flex justify-center items-center gap-4">
          <h3 className="text-lg font-semibold mb-4">Select a Tile</h3>
          <button
            className={`px-4 py-2 text-white rounded hover:bg-blue-700 transition ${
              selectedType === "floor" ? "bg-blue-600" : "bg-gray-600"
            }`}
            onClick={() => setSelectedType("floor")}
          >
            Floor
          </button>
          <button
            className={`px-4 py-2 text-white rounded hover:bg-blue-700 transition ${
              selectedType === "wall" ? "bg-blue-600" : "bg-gray-600"
            }`}
            onClick={() => setSelectedType("wall")}
          >
            Wall
          </button>
          <button
            className="px-4 py-2 bg-white rounded transition"
            onClick={onProceed}
          >
            Next
          </button>
        </div>
        <div className="flex gap-4">
          {tileImages.map((src, idx) => (
            <button
              key={idx}
              onClick={() => onSelectTile(src)}
              className={
                "border-2 rounded overflow-hidden transition-all cursor-pointer"
              }
            >
              <img
                src={src}
                alt={`Tile ${idx}`}
                className="w-full h-24 object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* 3D Room Viewer */}
      {/* <div className="flex-1">
        <TileRoom tileUrl={selectedTile} />
      </div> */}
    </div>
  );
};

export default TileSelection;
