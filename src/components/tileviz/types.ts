export type GroutColor = string; // hex
export type PatternKind = "grid" | "brick50" | "brick33" | "diagonal45";
export type PlaneKind = "xz" | "xy" | "yz"; // floor, XY wall, YZ wall

export interface FloorProps {
  roomW: number;
  roomD: number;
  tileW: number;
  tileH: number;
  groutW: number;
  groutColor: GroutColor;
  texturePath: string;
  pattern: PatternKind;
}

export interface WallsProps {
  roomW: number;
  roomD: number;
  roomH: number;
  // wall material controls (shared across all 4 walls)
  tileW: number;
  tileH: number;
  groutW: number;
  groutColor: GroutColor;
  texturePath: string;
}
