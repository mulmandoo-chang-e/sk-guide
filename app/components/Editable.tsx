"use client";

import { useEffect, useState } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export default function Editable({
  value,
  onChange,
  className = "",
}: Props) {

  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <input
      value={localValue}

      onChange={(e) => {
        setLocalValue(e.target.value);
      }}

      onBlur={() => {
        onChange?.(localValue);
      }}

      className={`
        bg-transparent
        outline-none
        ${className}
      `}
    />
  );
}