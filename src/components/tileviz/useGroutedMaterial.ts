import * as THREE from "three";
import { useEffect, useMemo } from "react";
import { useTexture } from "@react-three/drei";
import type { PatternKind, PlaneKind } from "./types";

interface Params {
  tileW: number;
  tileH: number;
  groutW: number;
  groutColor: string;
  texturePath: string;
  pattern?: PatternKind; // defaults to 'grid' for walls
  plane: PlaneKind; // 'xz' (floor) | 'xy' | 'yz' (walls)
}

function paramsFor(pattern: PatternKind | undefined) {
  switch (pattern) {
    case "brick50":
      return { rotation: 0.0, offsetRatio: 0.5, rowCycle: 2.0 };
    case "brick33":
      return { rotation: 0.0, offsetRatio: 1.0 / 3.0, rowCycle: 3.0 };
    case "diagonal45":
      return { rotation: Math.PI / 4, offsetRatio: 0.0, rowCycle: 1.0 };
    case "grid":
    default:
      return { rotation: 0.0, offsetRatio: 0.0, rowCycle: 1.0 };
  }
}

function planeIndex(plane: PlaneKind) {
  // 0 = XZ, 1 = XY, 2 = YZ (we switch in shader)
  return plane === "xz" ? 0 : plane === "xy" ? 1 : 2;
}

export function useGroutedMaterial({
  tileW,
  tileH,
  groutW,
  groutColor,
  texturePath,
  pattern = "grid",
  plane,
}: Params) {
  const map = useTexture(texturePath);
  useEffect(() => {
    if (!map) return;
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 8;
    map.needsUpdate = true;
  }, [map]);

  const { rotation, offsetRatio, rowCycle } = paramsFor(pattern);
  const pIndex = planeIndex(plane);

  const material = useMemo(() => {
    const uniforms = {
      uMap: { value: map },
      uTileSize: {
        value: new THREE.Vector2(Math.max(0.01, tileW), Math.max(0.01, tileH)),
      },
      uGroutW: { value: Math.max(0, groutW) },
      uGroutColor: { value: new THREE.Color(groutColor) },
      uRotation: { value: rotation }, // radians
      uOffsetRatio: { value: offsetRatio }, // 0..1 (stagger for brick)
      uRowCycle: { value: Math.max(1.0, rowCycle) },
      uPlane: { value: pIndex }, // 0=XZ, 1=XY, 2=YZ
    } as const;

    const onBeforeCompile = (shader: any) => {
      Object.assign(shader.uniforms, uniforms);

      shader.vertexShader = shader.vertexShader
        .replace("void main() {", "varying vec3 vWorldPos;\nvoid main() {")
        .replace(
          "#include <worldpos_vertex>",
          "#include <worldpos_vertex>\n vWorldPos = worldPosition.xyz;"
        );

      shader.fragmentShader = shader.fragmentShader
        .replace(
          "void main() {",
          `
varying vec3 vWorldPos;
uniform sampler2D uMap;
uniform vec2  uTileSize;
uniform float uGroutW;
uniform vec3  uGroutColor;
uniform float uRotation;
uniform float uOffsetRatio;
uniform float uRowCycle;
uniform float uPlane; // 0=XZ,1=XY,2=YZ

mat2 rot(float a){ float s=sin(a), c=cos(a); return mat2(c,-s,s,c); }

vec2 pickPlane(vec3 wp) {
  if (uPlane < 0.5) { return vec2(wp.x, wp.z); }   // XZ (floor)
  else if (uPlane < 1.5) { return vec2(wp.x, wp.y); } // XY (front/back walls)
  else { return vec2(wp.z, wp.y); }                 // YZ (left/right walls)
}

void main() {
          `
        )
        .replace(
          "#include <map_fragment>",
          `vec2 p  = pickPlane(vWorldPos);
vec2 pr = rot(uRotation) * p;

// Rows run along pr.y; do staggered offsets if needed
float row = floor(pr.y / uTileSize.y);
float k = mod(row, uRowCycle);
float offset = k * (uOffsetRatio * uTileSize.x);
vec2 pr2 = vec2(pr.x + offset, pr.y);

// Local coords within tile (meters)
vec2 local = fract(pr2 / uTileSize) * uTileSize;

// Grout near edges
float gw = uGroutW;
float edgeX = min(local.x, uTileSize.x - local.x);
float edgeY = min(local.y, uTileSize.y - local.y);
float inGrout = step(edgeX, gw * 0.5) + step(edgeY, gw * 0.5);
inGrout = clamp(inGrout, 0.0, 1.0);

// Sample base texture in same space
vec2 uv = pr2 / uTileSize;
vec4 baseCol = texture2D(uMap, uv);

// Composite grout over base
vec3 color = mix(baseCol.rgb, uGroutColor, inGrout);
diffuseColor = vec4(color, 1.0);
          `
        );
    };

    const mat = new THREE.MeshStandardMaterial({ color: "#ffffff" });
    (mat as any).onBeforeCompile = onBeforeCompile;
    mat.needsUpdate = true;
    return mat;
  }, [
    map,
    tileW,
    tileH,
    groutW,
    groutColor,
    rotation,
    offsetRatio,
    rowCycle,
    pIndex,
  ]);

  return material;
}
