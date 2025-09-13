import React, { useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
} from "@react-three/drei";
import { Floor } from "../../components/tileviz/Floor";
import { Walls } from "../../components/tileviz/Walls";
import { Lights } from "../../components/tileviz/Lights";
import { Controls } from "../../components/tileviz/Controls";
import type { PatternKind } from "../../components/tileviz/types";

export default function Page() {
  // Room (meters)
  const [roomW, setRoomW] = useState(4);
  const [roomD, setRoomD] = useState(3);
  const [roomH, setRoomH] = useState(2.6);

  // Tile (meters)
  const [tileW, setTileW] = useState(0.6);
  const [tileH, setTileH] = useState(0.6);

  // Grout
  const [groutW, setGroutW] = useState(0.004);
  const [groutColor, setGroutColor] = useState("#d9d9d9");

  // Pattern
  const [pattern, setPattern] = useState<PatternKind>("grid");

  const floorArea = useMemo(() => roomW * roomD, [roomW, roomD]);
  const tileArea = useMemo(() => tileW * tileH, [tileW, tileH]);
  const tileCount = useMemo(
    () => Math.ceil(floorArea / Math.max(0.0001, tileArea)),
    [floorArea, tileArea]
  );
  const withWaste = Math.ceil(tileCount * 1.1);

  return (
    <div className="flex h-screen w-full bg-white">
      <div className="flex-1 relative">
        <Canvas shadows dpr={[1, 2]}>
          <color attach="background" args={["#ffffff"]} />
          <PerspectiveCamera makeDefault position={[4, 3, 4]} fov={50} />
          <OrbitControls
            target={[0, 0.2, 0]}
            maxPolarAngle={Math.PI / 2.05}
            enableDamping
          />
          <Lights />
          <Environment preset="apartment" />

          <group>
            <Floor
              roomW={roomW}
              roomD={roomD}
              tileW={tileW}
              tileH={tileH}
              groutW={groutW}
              groutColor={groutColor}
              texturePath="/textures/tile_basecolor.jpg"
              pattern={pattern}
            />
            <Walls roomW={roomW} roomD={roomD} roomH={roomH} />
          </group>
        </Canvas>

        <div className="absolute left-4 top-4 rounded-2xl bg-white/80 shadow p-3 text-xs">
          <div>
            Floor area: <strong>{floorArea.toFixed(2)} m²</strong>
          </div>
          <div>
            Tile:{" "}
            <strong>
              {(tileW * 1000).toFixed(0)}×{(tileH * 1000).toFixed(0)} mm
            </strong>
          </div>
          <div>
            Tiles (10% waste): <strong>{withWaste}</strong>
          </div>
        </div>
      </div>

      <Controls
        roomW={roomW}
        setRoomW={setRoomW}
        roomD={roomD}
        setRoomD={setRoomD}
        roomH={roomH}
        setRoomH={setRoomH}
        tileW={tileW}
        setTileW={setTileW}
        tileH={tileH}
        setTileH={setTileH}
        groutW={groutW}
        setGroutW={setGroutW}
        groutColor={groutColor}
        setGroutColor={setGroutColor}
        pattern={pattern}
        setPattern={setPattern}
      />
    </div>
  );
}
