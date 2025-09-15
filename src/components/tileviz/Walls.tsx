import React, { useEffect } from "react";
import * as THREE from "three";
import { useGroutedMaterial } from "./useGroutedMaterial";

// walls we can hide
const OPEN_WALLS = ["front", "back", "left", "right"] as const;
type OpenWall = (typeof OPEN_WALLS)[number];

interface WallsProps {
  roomW: number;
  roomD: number;
  roomH: number;

  // shared wall material params
  tileW: number;
  tileH: number;
  groutW: number;
  groutColor: string;
  texturePath: string;

  /** Render both sides of each wall (handy if viewing from outside). Default: false */
  doubleSided?: boolean;

  /** 👇 NEW: open multiple walls, e.g. "front,back" or ["front","right"] */
  openWalls?: OpenWall[] | string;

  /** Back-compat (single wall). Prefer openWalls. */
  openWall?: OpenWall | "none";

  /** Optional ceiling */
  showCeiling?: boolean;

  /** Optional wall opacity (0..1). Default: 1 */
  opacity?: number;
}

function normalizeOpenWalls(
  openWalls?: OpenWall[] | string,
  openWall?: OpenWall | "none"
): Set<OpenWall> {
  let list: string[] = [];
  if (Array.isArray(openWalls)) {
    list = openWalls;
  } else if (typeof openWalls === "string") {
    list = openWalls.split(",");
  } else if (openWall && openWall !== "none") {
    list = [openWall];
  }
  const clean = list
    .map((s) => s.trim().toLowerCase())
    .filter((s): s is OpenWall =>
      (OPEN_WALLS as readonly string[]).includes(s)
    );
  return new Set(clean);
}

export const Walls: React.FC<WallsProps> = ({
  roomW,
  roomD,
  roomH,
  tileW,
  tileH,
  groutW,
  groutColor,
  texturePath,
  doubleSided = false,
  openWalls,
  openWall, // deprecated
  showCeiling = false,
  opacity = 1,
}) => {
  const matXY = useGroutedMaterial({
    tileW,
    tileH,
    groutW,
    groutColor,
    texturePath,
    pattern: "grid",
    plane: "xy",
  });
  const matYZ = useGroutedMaterial({
    tileW,
    tileH,
    groutW,
    groutColor,
    texturePath,
    pattern: "grid",
    plane: "yz",
  });

  const open = normalizeOpenWalls(openWalls, openWall);

  useEffect(() => {
    const side = doubleSided ? THREE.DoubleSide : THREE.FrontSide;
    matXY.side = side;
    matYZ.side = side;
    matXY.transparent = opacity < 1;
    matYZ.transparent = opacity < 1;
    matXY.opacity = opacity;
    matYZ.opacity = opacity;
  }, [matXY, matYZ, doubleSided, opacity]);

  return (
    <group>
      {/* BACK wall (z = -D/2) – normal inward (+Z) */}
      {!open.has("back") && (
        <mesh position={[0, roomH / 2, -roomD / 2]}>
          <planeGeometry args={[roomW, roomH, 1, 1]} />
          <primitive object={matXY as any} attach="material" />
        </mesh>
      )}

      {/* FRONT wall (z = +D/2) – rotate 180° so normal inward (-Z) */}
      {!open.has("front") && (
        <mesh position={[0, roomH / 2, roomD / 2]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[roomW, roomH, 1, 1]} />
          <primitive object={matXY as any} attach="material" />
        </mesh>
      )}

      {/* LEFT wall (x = -W/2) – rotate +90° yaw to face inward (+X) */}
      {!open.has("left") && (
        <mesh
          position={[-roomW / 2, roomH / 2, 0]}
          rotation={[0, Math.PI / 2, 0]}
        >
          <planeGeometry args={[roomD, roomH, 1, 1]} />
          <primitive object={matYZ as any} attach="material" />
        </mesh>
      )}

      {/* RIGHT wall (x = +W/2) – rotate -90° yaw to face inward (-X) */}
      {!open.has("right") && (
        <mesh
          position={[roomW / 2, roomH / 2, 0]}
          rotation={[0, -Math.PI / 2, 0]}
        >
          <planeGeometry args={[roomD, roomH, 1, 1]} />
          <primitive object={matYZ as any} attach="material" />
        </mesh>
      )}

      {showCeiling && (
        <mesh position={[0, roomH, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[roomW, roomD, 1, 1]} />
          <meshStandardMaterial
            color="#f5f6f7"
            side={doubleSided ? THREE.DoubleSide : THREE.FrontSide}
          />
        </mesh>
      )}
    </group>
  );
};
