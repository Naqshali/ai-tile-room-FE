import React, { useMemo, useRef, useState } from "react";
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

  // Floor tile (meters)
  const [tileW, setTileW] = useState(0.6);
  const [tileH, setTileH] = useState(0.6);
  const [groutW, setGroutW] = useState(0.004);
  const [groutColor, setGroutColor] = useState("#d9d9d9");
  const [pattern, setPattern] = useState<PatternKind>("grid");
  const [floorTextureUrl, setFloorTextureUrl] = useState(
    "/textures/tile_basecolor.jpg"
  );

  // Walls tile (meters)
  const [wallTileW, setWallTileW] = useState(0.3);
  const [wallTileH, setWallTileH] = useState(0.6);
  const [wallGroutW, setWallGroutW] = useState(0.003);
  const [wallGroutColor, setWallGroutColor] = useState("#e0e0e0");
  const [wallTextureUrl, setWallTextureUrl] = useState(
    "/textures/wall_tile_basecolor.jpg"
  );

  // Revoke old blob URLs when replacing
  const prevFloorBlob = useRef<string | null>(null);
  const prevWallBlob = useRef<string | null>(null);

  const onFloorFile = (file: File | null) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (prevFloorBlob.current) URL.revokeObjectURL(prevFloorBlob.current);
    prevFloorBlob.current = url;
    setFloorTextureUrl(url);
  };
  const onWallFile = (file: File | null) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (prevWallBlob.current) URL.revokeObjectURL(prevWallBlob.current);
    prevWallBlob.current = url;
    setWallTextureUrl(url);
  };

  // Quick estimates
  const floorArea = useMemo(() => roomW * roomD, [roomW, roomD]);
  const tileArea = useMemo(() => tileW * tileH, [tileW, tileH]);
  const tileCount = useMemo(
    () => Math.ceil(floorArea / Math.max(0.0001, tileArea)),
    [floorArea, tileArea]
  );
  const withWaste = Math.ceil(tileCount * 1.1);

  // Snapshot (optional; already shown in earlier step)
  const glRef = useRef<any>(null);
  const sceneRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);

  return (
    <div className="flex h-screen w-full bg-white">
      <div className="flex-1 relative">
        <Canvas
          shadows
          dpr={[1, 2]}
          onCreated={(state) => {
            glRef.current = state.gl;
            sceneRef.current = state.scene;
            cameraRef.current = state.camera;
          }}
        >
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
              texturePath={floorTextureUrl}
              pattern={pattern}
            />
            <Walls
              roomW={roomW}
              roomD={roomD}
              roomH={roomH}
              tileW={wallTileW}
              tileH={wallTileH}
              groutW={wallGroutW}
              groutColor={wallGroutColor}
              texturePath={wallTextureUrl}
              doubleSided={true} // single-sided, normals face inward
              // openWalls={["front", "back"]}
            />
          </group>
        </Canvas>

        <div className="absolute left-4 top-4 rounded-2xl bg-white/80 shadow p-3 text-xs space-y-1">
          <div>
            Floor area: <strong>{floorArea.toFixed(2)} m²</strong>
          </div>
          <div>
            Floor tile:{" "}
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
        // room
        roomW={roomW}
        setRoomW={setRoomW}
        roomD={roomD}
        setRoomD={setRoomD}
        roomH={roomH}
        setRoomH={setRoomH}
        // floor
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
        floorTextureUrl={floorTextureUrl}
        setFloorTextureUrl={setFloorTextureUrl}
        onFloorFile={onFloorFile}
        // walls
        wallTileW={wallTileW}
        setWallTileW={setWallTileW}
        wallTileH={wallTileH}
        setWallTileH={setWallTileH}
        wallGroutW={wallGroutW}
        setWallGroutW={setWallGroutW}
        wallGroutColor={wallGroutColor}
        setWallGroutColor={setWallGroutColor}
        wallTextureUrl={wallTextureUrl}
        setWallTextureUrl={setWallTextureUrl}
        onWallFile={onWallFile}
      />
    </div>
  );
}
