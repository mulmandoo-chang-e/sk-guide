"use client";

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
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`
        bg-transparent
        outline-none
        ${className}
      `}
    />
  );
}