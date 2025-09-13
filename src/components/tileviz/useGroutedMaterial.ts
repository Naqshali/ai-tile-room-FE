import * as THREE from "three";
import { useEffect, useMemo } from "react";
import { useTexture } from "@react-three/drei";

type Params = {
  tileW: number;
  tileH: number;
  groutW: number;
  groutColor: string;
  texturePath: string;
};

// ✅ Type-safe extraction of onBeforeCompile shader parameter
type OnBeforeCompileShader = Parameters<
  NonNullable<THREE.MeshStandardMaterial["onBeforeCompile"]>
>[0];

export function useGroutedMaterial({
  tileW,
  tileH,
  groutW,
  groutColor,
  texturePath,
}: Params) {
  const map = useTexture(texturePath);

  // Setup texture properties
  useEffect(() => {
    if (!map) return;
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 8;
    map.needsUpdate = true;
  }, [map]);

  const material = useMemo(() => {
    // Define shader uniforms
    const uniforms = {
      uMap: { value: map },
      uTileSize: {
        value: new THREE.Vector2(Math.max(0.01, tileW), Math.max(0.01, tileH)),
      },
      uGroutW: { value: Math.max(0, groutW) },
      uGroutColor: { value: new THREE.Color(groutColor) },
      uRepeat: { value: new THREE.Vector2(1, 1) },
      uRoomSize: { value: new THREE.Vector2(1, 1) },
    } as const;

    // Shader modification
    const onBeforeCompile = (shader: OnBeforeCompileShader) => {
      Object.assign(shader.uniforms, uniforms);

      // Vertex Shader
      shader.vertexShader = shader.vertexShader.replace(
        "void main() {",
        `varying vec3 vWorldPos;
        void main() {`
      );

      shader.vertexShader = shader.vertexShader.replace(
        "#include <worldpos_vertex>",
        `#include <worldpos_vertex>
        vWorldPos = worldPosition.xyz;`
      );

      // Fragment Shader
      shader.fragmentShader = shader.fragmentShader.replace(
        "void main() {",
        `varying vec3 vWorldPos;
        uniform sampler2D uMap;
        uniform vec2 uTileSize;
        uniform float uGroutW;
        uniform vec3 uGroutColor;
        uniform vec2 uRepeat;
        uniform vec2 uRoomSize;

        vec2 worldToUV(vec2 worldXY) {
          return worldXY / uTileSize;
        }
        void main() {`
      );

      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <map_fragment>",
        `vec2 w = vWorldPos.xz;
        vec2 local = fract(w / uTileSize) * uTileSize;
        float gw = uGroutW;
        float edgeX = min(local.x, uTileSize.x - local.x);
        float edgeY = min(local.y, uTileSize.y - local.y);
        float inGrout = step(edgeX, gw * 0.5) + step(edgeY, gw * 0.5);
        inGrout = clamp(inGrout, 0.0, 1.0);

        vec2 uv = worldToUV(w);
        vec4 baseCol = texture2D(uMap, uv);
        vec3 color = mix(baseCol.rgb, uGroutColor, inGrout);
        diffuseColor = vec4(color, 1.0);`
      );
    };

    // Create material
    const mat = new THREE.MeshStandardMaterial({ color: "#ffffff" });
    mat.onBeforeCompile = onBeforeCompile;
    mat.needsUpdate = true;

    return mat;
  }, [map, tileW, tileH, groutW, groutColor]);

  return material;
}
