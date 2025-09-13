import * as THREE from "three";
import { useEffect, useMemo } from "react";
import { useTexture } from "@react-three/drei";
import type { PatternKind } from "./types";

interface Params {
  tileW: number;
  tileH: number;
  groutW: number;
  groutColor: string;
  texturePath: string;
  pattern: PatternKind;
}

function paramsFor(pattern: PatternKind) {
  // rotation in radians, rowCycle is the number of rows per cycle for stagger
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

export function useGroutedMaterial({
  tileW,
  tileH,
  groutW,
  groutColor,
  texturePath,
  pattern,
}: Params) {
  const map = useTexture(texturePath);

  useEffect(() => {
    if (!map) return;
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 8;
    map.needsUpdate = true;
  }, [map]);

  const { rotation, offsetRatio, rowCycle } = paramsFor(pattern);

  const material = useMemo(() => {
    const uniforms = {
      uMap: { value: map },
      uTileSize: {
        value: new THREE.Vector2(Math.max(0.01, tileW), Math.max(0.01, tileH)),
      },
      uGroutW: { value: Math.max(0, groutW) },
      uGroutColor: { value: new THREE.Color(groutColor) },
      uRotation: { value: rotation }, // radians
      uOffsetRatio: { value: offsetRatio }, // 0..1
      uRowCycle: { value: Math.max(1.0, rowCycle) }, // >=1
    } as const;

    const onBeforeCompile = (shader: any) => {
      Object.assign(shader.uniforms, uniforms);

      // Keep world position varying
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

            mat2 rot(float a){ float s=sin(a), c=cos(a); return mat2(c,-s,s,c); }

            void main() {
                    `
        )
        .replace(
          "#include <map_fragment>",
          `// Floor is in XZ plane; transform to pattern frame
            vec2 p  = vWorldPos.xz;
            vec2 pr = rot(uRotation) * p;

            // Determine row index in rotated space (Y axis of pr is "rows")
            float row = floor(pr.y / uTileSize.y);

            // Apply staggered offset along X depending on row modulo cycle
            float k = mod(row, uRowCycle);      // 0..rowCycle-1
            float offset = k * (uOffsetRatio * uTileSize.x);
            vec2 pr2 = vec2(pr.x + offset, pr.y);

            // Local coords within a single tile (in meters)
            vec2 local = fract(pr2 / uTileSize) * uTileSize;

            // Grout mask: near any tile edge within half grout width
            float gw = uGroutW;
            float edgeX = min(local.x, uTileSize.x - local.x);
            float edgeY = min(local.y, uTileSize.y - local.y);
            float inGrout = step(edgeX, gw * 0.5) + step(edgeY, gw * 0.5);
            inGrout = clamp(inGrout, 0.0, 1.0);

            // Sample base texture in the same rotated/staggered space
            vec2 uv = pr2 / uTileSize;
            vec4 baseCol = texture2D(uMap, uv);

            // Composite: simple overlay of grout color
            vec3 color = mix(baseCol.rgb, uGroutColor, inGrout);
            diffuseColor = vec4(color, 1.0);
          `
        );
    };

    const mat = new THREE.MeshStandardMaterial({ color: "#ffffff" });
    (mat as any).onBeforeCompile = onBeforeCompile;
    mat.needsUpdate = true;
    return mat;
  }, [map, tileW, tileH, groutW, groutColor, rotation, offsetRatio, rowCycle]);

  return material;
}
