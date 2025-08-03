import { create } from "zustand";

const mainStore = create((set) => ({
  selectedFloorTile: "/tiles/grey-slate.jpg",
  selectedWallTile: "/tiles/grey-slate.jpg",
  lighting: "studio",
  setSelectedFloorTile: (tile) => set({ selectedFloorTile: tile }),
  setSelectedWallTile: (tile) => set({ selectedWallTile: tile }),
  setLighting: (mode) => set({ lighting: mode }),
}));

export default mainStore;
