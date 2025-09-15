import React, { ChangeEvent } from "react";
import { NumberInput } from "./NumberInput";
import type { PatternKind } from "./types";

interface Props {
  // room
  roomW: number;
  setRoomW: (v: number) => void;
  roomD: number;
  setRoomD: (v: number) => void;
  roomH: number;
  setRoomH: (v: number) => void;

  // floor
  tileW: number;
  setTileW: (v: number) => void;
  tileH: number;
  setTileH: (v: number) => void;
  groutW: number;
  setGroutW: (v: number) => void;
  groutColor: string;
  setGroutColor: (v: string) => void;
  pattern: PatternKind;
  setPattern: (p: PatternKind) => void;
  floorTextureUrl: string;
  setFloorTextureUrl: (v: string) => void;
  onFloorFile: (file: File | null) => void;

  // walls
  wallTileW: number;
  setWallTileW: (v: number) => void;
  wallTileH: number;
  setWallTileH: (v: number) => void;
  wallGroutW: number;
  setWallGroutW: (v: number) => void;
  wallGroutColor: string;
  setWallGroutColor: (v: string) => void;
  wallTextureUrl: string;
  setWallTextureUrl: (v: string) => void;
  onWallFile: (file: File | null) => void;
}

const Label: React.FC<React.PropsWithChildren> = ({ children }) => (
  <label className="self-center text-sm text-gray-700">{children}</label>
);

export const Controls: React.FC<Props> = (p) => {
  const onFile = (
    e: ChangeEvent<HTMLInputElement>,
    cb: (f: File | null) => void
  ) => {
    const f = e.target.files?.[0] || null;
    cb(f);
  };

  return (
    <div className="w-[26rem] border-l bg-gray-50 p-5 space-y-6 overflow-y-auto">
      <h2 className="text-xl font-semibold">Room</h2>
      <div className="grid grid-cols-2 gap-3">
        <Label>Width (m)</Label>
        <NumberInput value={p.roomW} onChange={p.setRoomW} step={0.1} min={1} />
        <Label>Depth (m)</Label>
        <NumberInput value={p.roomD} onChange={p.setRoomD} step={0.1} min={1} />
        <Label>Height (m)</Label>
        <NumberInput value={p.roomH} onChange={p.setRoomH} step={0.1} min={2} />
      </div>

      <h2 className="text-xl font-semibold">Floor</h2>
      <div className="grid grid-cols-2 gap-3">
        <Label>Tile W (m)</Label>
        <NumberInput
          value={p.tileW}
          onChange={p.setTileW}
          step={0.01}
          min={0.05}
        />
        <Label>Tile H (m)</Label>
        <NumberInput
          value={p.tileH}
          onChange={p.setTileH}
          step={0.01}
          min={0.05}
        />
        <Label>Grout W (m)</Label>
        <NumberInput
          value={p.groutW}
          onChange={p.setGroutW}
          step={0.001}
          min={0}
        />
        <Label>Grout Color</Label>
        <input
          className="rounded-md border p-2 bg-white"
          type="color"
          value={p.groutColor}
          onChange={(e) => p.setGroutColor(e.target.value)}
        />
        <Label>Pattern</Label>
        <select
          value={p.pattern}
          onChange={(e) => p.setPattern(e.target.value as PatternKind)}
          className="rounded-md border p-2 bg-white"
        >
          <option value="grid">Grid</option>
          <option value="brick50">Brick 50%</option>
          <option value="brick33">Brick 33%</option>
          <option value="diagonal45">Diagonal 45°</option>
        </select>

        <Label>Floor image URL</Label>
        <input
          className="rounded-md border p-2 bg-white"
          type="url"
          placeholder="/textures/tile_basecolor.jpg"
          value={p.floorTextureUrl}
          onChange={(e) => p.setFloorTextureUrl(e.target.value)}
        />
        <Label>Floor image file</Label>
        <input
          className="rounded-md border p-2 bg-white"
          type="file"
          accept="image/*"
          onChange={(e) => onFile(e, p.onFloorFile)}
        />
      </div>

      <h2 className="text-xl font-semibold">Walls</h2>
      <div className="grid grid-cols-2 gap-3">
        <Label>Tile W (m)</Label>
        <NumberInput
          value={p.wallTileW}
          onChange={p.setWallTileW}
          step={0.01}
          min={0.05}
        />
        <Label>Tile H (m)</Label>
        <NumberInput
          value={p.wallTileH}
          onChange={p.setWallTileH}
          step={0.01}
          min={0.05}
        />
        <Label>Grout W (m)</Label>
        <NumberInput
          value={p.wallGroutW}
          onChange={p.setWallGroutW}
          step={0.001}
          min={0}
        />
        <Label>Grout Color</Label>
        <input
          className="rounded-md border p-2 bg-white"
          type="color"
          value={p.wallGroutColor}
          onChange={(e) => p.setWallGroutColor(e.target.value)}
        />

        <Label>Wall image URL</Label>
        <input
          className="rounded-md border p-2 bg-white"
          type="url"
          placeholder="/textures/wall_tile_basecolor.jpg"
          value={p.wallTextureUrl}
          onChange={(e) => p.setWallTextureUrl(e.target.value)}
        />
        <Label>Wall image file</Label>
        <input
          className="rounded-md border p-2 bg-white"
          type="file"
          accept="image/*"
          onChange={(e) => onFile(e, p.onWallFile)}
        />
      </div>

      <div className="pt-2 text-xs text-gray-600">
        Tip: Prefer images in <code>/public/textures</code> to avoid CORS
        issues. Uploads use a local blob URL (not persisted).
      </div>
    </div>
  );
};
