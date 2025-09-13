import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export const Lights: React.FC = () => {
  const dir = useRef<any>(null);
  useFrame(({ clock }) => {
    if (!dir.current) return;
    const t = clock.getElapsedTime() * 0.05;
    dir.current.position.set(Math.sin(t) * 3, 4, Math.cos(t) * 3);
    dir.current.target.position.set(0, 0, 0);
    dir.current.target.updateMatrixWorld();
  });
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight
        ref={dir}
        intensity={0.8}
        castShadow
        position={[3, 4, 3]}
      />
    </>
  );
};
