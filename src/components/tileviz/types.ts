export type GroutColor = string; // hex

export interface FloorProps {
  roomW: number;
  roomD: number;
  tileW: number;
  tileH: number;
  groutW: number; // meters
  groutColor: GroutColor;
  texturePath: string;
}

export interface WallsProps {
  roomW: number;
  roomD: number;
  roomH: number;
}
