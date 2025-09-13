import React from "react";

interface Props {
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
}

export const NumberInput: React.FC<Props> = ({
  value,
  onChange,
  step = 0.1,
  min = 0,
}) => (
  <input
    type="number"
    min={min}
    step={step}
    value={value}
    onChange={(e) => onChange(parseFloat(e.target.value))}
    className="w-full rounded-md border p-2 bg-white"
  />
);
