import mainStore from "../store/main";

const LightingSelector = () => {
  const { lighting, setLighting } = mainStore();

  return (
    <div className="absolute top-4 left-4 z-50 bg-white text-black p-2 rounded shadow">
      <label className="block mb-1 text-sm font-medium">Lighting:</label>
      <select
        className="border px-2 py-1 rounded text-sm"
        value={lighting}
        onChange={(e) => setLighting(e.target.value)}
      >
        <option value="studio">Studio</option>
        <option value="daylight">Daylight</option>
        <option value="night">Night</option>
        <option value="ambientOnly">Ambient Only</option>
      </select>
    </div>
  );
};

export default LightingSelector;
