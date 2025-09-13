export type GroutColor = string; // hex

export type PatternKind = "grid" | "brick50" | "brick33" | "diagonal45";

export interface FloorProps {
  roomW: number;
  roomD: number;
  tileW: number;
  tileH: number;
  groutW: number; // meters
  groutColor: GroutColor;
  texturePath: string;
  pattern: PatternKind;
}

export interface WallsProps {
  roomW: number;
  roomD: number;
  roomH: number;
}
