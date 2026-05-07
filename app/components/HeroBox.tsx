"use client";

import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import { storage } from "../firebase";

type Props = {
  image: string;

  onChange: (url: string) => void;

  pet?: boolean;
  defense?: boolean;
};

export default function HeroBox({
  image,
  onChange,

  pet = false,
  defense = false,
}: Props) {
  const size = defense
    ? pet
      ? "w-[64px] h-[64px]"
      : "w-[120px] h-[120px]"
    : pet
    ? "w-[48px] h-[48px]"
    : "w-[78px] h-[78px]";

  const uploadImage = async (e: any) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const imageRef = storageRef(
      storage,
      `images/${Date.now()}-${file.name}`
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

          border border-red-700
          rounded-md
          bg-[#111]

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
            이미지
          </span>
        )}

        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={uploadImage}
        />
      </label>

      <div className="border border-red-700 text-[9px] px-2 py-[1px]">
        설명 입력
      </div>
    </div>
  );
}