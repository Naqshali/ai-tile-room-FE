import React, { useEffect } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";
import mainStore from "../store/main";
import LightingSelector from "./LightingSelector";

const TileRoom = () => {
  const { selectedWallTile, selectedFloorTile, lighting } = mainStore();

  const wallTexture = useLoader(THREE.TextureLoader, selectedWallTile);
  const floorTexture = useLoader(THREE.TextureLoader, selectedFloorTile);

  const rows = 2; // Number of tiles vertically
  const cols = 2; // Number of tiles horizontally

  const lightingPresets = {
    studio: {
      ambient: 0.4,
      directional: { intensity: 1.2, position: [10, 20, 10], color: 0xffffff },
    },
    daylight: {
      ambient: 0.3,
      directional: { intensity: 1.5, position: [50, 100, 0], color: 0xfff2cc },
    },
    night: {
      ambient: 0.1,
      directional: { intensity: 0.5, position: [-10, 5, -10], color: 0x445566 },
    },
    ambientOnly: {
      ambient: 0.7,
      directional: { intensity: 0 },
    },
  };

  const preset = lightingPresets[lighting] || lightingPresets.studio;

  // ⬅ Wall Texture Setup
  useEffect(() => {
    if (wallTexture) {
      wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;
      wallTexture.repeat.set(rows, cols);
    }
  }, [wallTexture, rows, cols]);

  // ⬅ Floor Texture Setup
  useEffect(() => {
    if (floorTexture) {
      floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
      floorTexture.repeat.set(rows, cols); // Square tiling on floor
    }
  }, [floorTexture, cols]);

  const wallMaterial = (
    <meshPhysicalMaterial
      map={wallTexture}
      roughness={0.6}
      metalness={0.1}
      reflectivity={0}
    />
  );

  const floorMaterial = (
    <meshPhysicalMaterial
      map={floorTexture}
      roughness={0.4}
      metalness={0.2}
      reflectivity={0.5}
    />
  );

  const size = 100;

  return (
    <div style={{ width: "100vw", height: "100vh", backgroundColor: "black" }}>
      <LightingSelector />
      <Canvas shadows camera={{ position: [0, 100, 320], fov: 50 }}>
        {/* Lights */}
        <ambientLight intensity={preset.ambient} />

        {preset.directional.intensity > 0 && (
          <directionalLight
            position={preset.directional.position}
            intensity={preset.directional.intensity}
            color={preset.directional.color}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
        )}

        {/* Environment lighting */}
        <Environment preset="warehouse" />
        <OrbitControls target={[0, 100, 0]} />

        {/* Floor */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[size * 2, size * 2]} />
          {floorMaterial}
        </mesh>

        {/* Ceiling */}
        <mesh
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, size * 2, 0]}
          receiveShadow
        >
          <planeGeometry args={[size * 2, size * 2]} />
          {wallMaterial}
        </mesh>

        {/* Back wall */}
        <mesh position={[0, size, -size]} castShadow receiveShadow>
          <planeGeometry args={[size * 2, size * 2]} />
          {wallMaterial}
        </mesh>

        {/* Front wall */}
        <mesh rotation={[0, Math.PI, 0]} position={[0, size, size]} castShadow>
          <planeGeometry args={[size * 2, size * 2]} />
          {wallMaterial}
        </mesh>

        {/* Left wall */}
        <mesh
          rotation={[0, Math.PI / 2, 0]}
          position={[-size, size, 0]}
          castShadow
        >
          <planeGeometry args={[size * 2, size * 2]} />
          {wallMaterial}
        </mesh>

        {/* Right wall */}
        <mesh
          rotation={[0, -Math.PI / 2, 0]}
          position={[size, size, 0]}
          castShadow
        >
          <planeGeometry args={[size * 2, size * 2]} />
          {wallMaterial}
        </mesh>
      </Canvas>
    </div>
  );
};

export default TileRoom;
