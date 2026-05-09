"use client";

import Editable from "./Editable";

import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import { storage } from "../firebase";

type Props = {
  image: string;

  onChange: (url: string) => void;

  darkMode: boolean;

  defense?: boolean;
};

export default function SkillBox({
  image,
  onChange,

  description,
  onDescriptionChange,

  darkMode,

  defense,
}: Props) {
  const size = defense
  ? "w-[85px] h-[85px]"
  : "w-[68px] h-[68px]";

  const uploadImage = async (e: any) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const imageRef = storageRef(
      storage,
      `skills/${Date.now()}-${file.name}`
    );

    await uploadBytes(imageRef, file);

    const url = await getDownloadURL(imageRef);

    onChange(url);
  };

  return (
    <div className="flex flex-col items-center gap-[4px] shrink-0">
      <label
        className={`
          ${size}

          rounded-lg

transition-all duration-200

${
  darkMode
    ? `
      border border-red-900/70

      bg-[#151515]

      shadow-[0_0_12px_rgba(90,0,0,0.18)]
    `
    : `
      border border-gray-300

      bg-white

      shadow-sm
    `
}

          overflow-hidden
          cursor-pointer

          flex items-center justify-center
        `}
      >
        {image ? (
          <img
            src={image}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-500 text-[10px]">
            스킬
          </span>
        )}

        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={uploadImage}
        />
      </label>

      <div className="h-[12px] flex items-center justify-center">
  <Editable
    value={description}
    onChange={onDescriptionChange}
    className={`
  text-center

  text-[14px]

  leading-tight

  ${
    darkMode
      ? "text-gray-300"
      : "text-gray-700"
  }

  w-[60px]

  bg-transparent

  p-0
  m-0

  border-none
  outline-none
`}
  />
</div>
    </div>
  );
}