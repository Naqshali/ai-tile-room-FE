import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useGroutedMaterial } from "./useGroutedMaterial";
import type { FloorProps } from "./types";

export const Floor: React.FC<FloorProps> = ({
  roomW,
  roomD,
  tileW,
  tileH,
  groutW,
  groutColor,
  texturePath,
  pattern,
}) => {
  const mat = useGroutedMaterial({
    tileW,
    tileH,
    groutW,
    groutColor,
    texturePath,
    pattern,
  });
  const meshRef = useRef<THREE.Mesh>(null!);

  useEffect(() => {
    if (meshRef.current) meshRef.current.receiveShadow = true;
  }, []);

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[roomW, roomD, 1, 1]} />
      <primitive object={mat as any} attach="material" />
    </mesh>
  );
};
