import React from "react";
import type { WallsProps } from "./types";

export const Walls: React.FC<WallsProps> = ({ roomW, roomD, roomH }) => {
  const t = 0.05; // 5 cm
  return (
    <group>
      <mesh position={[0, roomH / 2, -roomD / 2]}>
        <boxGeometry args={[roomW, roomH, t]} />
        <meshStandardMaterial color="#f4f5f7" />
      </mesh>
      <mesh position={[0, roomH / 2, roomD / 2]}>
        <boxGeometry args={[roomW, roomH, t]} />
        <meshStandardMaterial color="#f8f9fa" />
      </mesh>
      <mesh position={[-roomW / 2, roomH / 2, 0]}>
        <boxGeometry args={[t, roomH, roomD]} />
        <meshStandardMaterial color="#f7f7f7" />
      </mesh>
      <mesh position={[roomW / 2, roomH / 2, 0]}>
        <boxGeometry args={[t, roomH, roomD]} />
        <meshStandardMaterial color="#f7f7f7" />
      </mesh>
    </group>
  );
};
