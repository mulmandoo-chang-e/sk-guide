"use client";

import { useEffect, useState } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
};

export default function Editable({
  value,
  onChange,
  className = "",
  disabled,
}: Props) {

  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <input
    disabled={disabled}

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