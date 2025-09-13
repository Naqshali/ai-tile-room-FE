import React from "react";
import { NumberInput } from "./NumberInput";
import type { PatternKind } from "./types";

interface Props {
  roomW: number;
  setRoomW: (v: number) => void;
  roomD: number;
  setRoomD: (v: number) => void;
  roomH: number;
  setRoomH: (v: number) => void;
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
}

const Label: React.FC<React.PropsWithChildren> = ({ children }) => (
  <label className="self-center text-sm text-gray-700">{children}</label>
);

export const Controls: React.FC<Props> = (p) => (
  <div className="w-96 border-l bg-gray-50 p-5 space-y-6 overflow-y-auto">
    <h2 className="text-xl font-semibold">Room</h2>
    <div className="grid grid-cols-2 gap-3">
      <Label>Width (m)</Label>
      <NumberInput value={p.roomW} onChange={p.setRoomW} step={0.1} min={1} />
      <Label>Depth (m)</Label>
      <NumberInput value={p.roomD} onChange={p.setRoomD} step={0.1} min={1} />
      <Label>Height (m)</Label>
      <NumberInput value={p.roomH} onChange={p.setRoomH} step={0.1} min={2} />
    </div>

    <h2 className="text-xl font-semibold">Tile</h2>
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
    </div>

    <h2 className="text-xl font-semibold">Pattern</h2>
    <div className="grid grid-cols-2 gap-3">
      <Label>Type</Label>
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
    </div>

    <h2 className="text-xl font-semibold">Grout</h2>
    <div className="grid grid-cols-2 gap-3">
      <Label>Width (m)</Label>
      <NumberInput
        value={p.groutW}
        onChange={p.setGroutW}
        step={0.001}
        min={0}
      />
      <Label>Color</Label>
      <input
        className="rounded-md border p-2 bg-white"
        type="color"
        value={p.groutColor}
        onChange={(e) => p.setGroutColor(e.target.value)}
      />
    </div>

    <div className="pt-4 text-sm text-gray-600">
      Put a seamless tile image at <code>/textures/tile_basecolor.jpg</code>.
    </div>
  </div>
);
