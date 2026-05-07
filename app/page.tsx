"use client";

import { useEffect, useState } from "react";

import Editable from "./components/Editable";
import HeroBox from "./components/HeroBox";
import SkillBox from "./components/SkillBox";

import { GuideData } from "./types";

import { db, storage } from "./firebase";

import {
  ref,
  set,
  onValue,
} from "firebase/database";

const createDeck = (title: string) => ({
  title,
  tip: "",

  heroes: ["", "", ""],
  pet: "",

  skills: ["", "", ""],
});

const defaultGuideData: GuideData = {
  logo: "",

  title: "세븐나이츠 리버스 길드전 가이드",

  nickname: "지약새",

  tabs: [
    "덱 1",
    "덱 2",
    "덱 3",
    "덱 4",
    "덱 5",
  ],

  attack: Array.from(
    { length: 9 },
    (_, i) =>
      createDeck(`공격덱 ${i + 1}`)
  ),

  defense: [
    createDeck("방어덱 1"),
    createDeck("방어덱 2"),
  ],
};

export default function Page() {
  const [guideData, setGuideData] =
    useState<GuideData>(
      defaultGuideData
    );

  const [activeTab, setActiveTab] =
    useState(0);

  const [isAdmin, setIsAdmin] =
    useState(false);

  const [password, setPassword] =
    useState("");

  /* Firebase Load */
  useEffect(() => {
    const guideRef =
      ref(db, "guideData");

    onValue(
      guideRef,
      (snapshot) => {
        const data = snapshot.val();

        if (data) {
          setGuideData(data);
        }
      }
    );
  }, []);

  /* Admin */
  useEffect(() => {
    const saved =
      localStorage.getItem(
        "sk-admin"
      );

    if (saved === "true") {
      setIsAdmin(true);
    }
  }, []);

  const login = () => {
    if (password === "1234") {
      setIsAdmin(true);

      localStorage.setItem(
        "sk-admin",
        "true"
      );
    }
  };

  const logout = () => {
    setIsAdmin(false);

    localStorage.removeItem(
      "sk-admin"
    );
  };

  /* Save */
  const saveData = async () => {
    await set(
      ref(db, "guideData"),
      guideData
    );

    alert("저장 완료");
  };

  /* Tabs */
  const addTab = () => {
    if (
      guideData.tabs.length >= 8
    )
      return;

    setGuideData({
      ...guideData,

      tabs: [
        ...guideData.tabs,
        `덱 ${
          guideData.tabs.length + 1
        }`,
      ],
    });
  };

  /* Attack Deck */
  const AttackDeck = ({
    deck,
    index,
  }: any) => (
    <div
      className="
        border border-red-700
        rounded-xl

        bg-black

        p-3

        flex flex-col gap-4
      "
    >
      <Editable
        value={deck.title}
        onChange={(v) => {
          const next = {
            ...guideData,
          };

          next.attack[index].title =
            v;

          setGuideData(next);
        }}
        className="
          text-red-500
          text-[22px]
          font-bold
        "
      />

      <div
        className="
          flex items-start gap-4
          flex-wrap
        "
      >
        <div className="flex gap-3">
          {deck.heroes.map(
            (
              hero: string,
              heroIndex: number
            ) => (
              <HeroBox
                key={heroIndex}
                image={hero}
                onChange={(
                  url
                ) => {
                  const next = {
                    ...guideData,
                  };

                  next.attack[
                    index
                  ].heroes[
                    heroIndex
                  ] = url;

                  setGuideData(
                    next
                  );
                }}
              />
            )
          )}
        </div>

        <div className="pt-[10px]">
          <HeroBox
            pet
            image={deck.pet}
            onChange={(url) => {
              const next = {
                ...guideData,
              };

              next.attack[
                index
              ].pet = url;

              setGuideData(next);
            }}
          />
        </div>
      </div>

      <div
        className="
          flex gap-6
          flex-wrap
        "
      >
        {deck.skills.map(
          (
            skill: string,
            skillIndex: number
          ) => (
            <SkillBox
              key={skillIndex}
              image={skill}
              onChange={(url) => {
                const next = {
                  ...guideData,
                };

                next.attack[
                  index
                ].skills[
                  skillIndex
                ] = url;

                setGuideData(next);
              }}
            />
          )
        )}
      </div>

      <div
        className="
          border border-red-700
          rounded-lg

          bg-[#111]

          p-3
        "
      >
        <div
          className="
            text-red-500
            font-bold
            text-[15px]

            mb-1
          "
        >
          TIP.
        </div>

        <Editable
          value={deck.tip}
          onChange={(v) => {
            const next = {
              ...guideData,
            };

            next.attack[index].tip =
              v;

            setGuideData(next);
          }}
          className="
            text-gray-300
            text-[12px]

            w-full
          "
        />
      </div>
    </div>
  );

  /* Defense Deck */
  const DefenseDeck = ({
    deck,
    index,
  }: any) => (
    <div
      className="
        border border-red-700
        rounded-xl

        bg-black

        p-4

        flex flex-col
        justify-between

        h-full
      "
    >
      <div
        className="
          flex flex-col gap-6
        "
      >
        <Editable
          value={deck.title}
          onChange={(v) => {
            const next = {
              ...guideData,
            };

            next.defense[index]
              .title = v;

            setGuideData(next);
          }}
          className="
            text-red-500
            text-[28px]
            font-bold
          "
        />

        <div
          className="
            flex items-start gap-5
            flex-wrap
          "
        >
          <div className="flex gap-4">
            {deck.heroes.map(
              (
                hero: string,
                heroIndex: number
              ) => (
                <HeroBox
                  key={heroIndex}
                  defense
                  image={hero}
                  onChange={(
                    url
                  ) => {
                    const next = {
                      ...guideData,
                    };

                    next.defense[
                      index
                    ].heroes[
                      heroIndex
                    ] = url;

                    setGuideData(
                      next
                    );
                  }}
                />
              )
            )}
          </div>

          <div className="pt-[12px]">
            <HeroBox
              pet
              defense
              image={deck.pet}
              onChange={(url) => {
                const next = {
                  ...guideData,
                };

                next.defense[
                  index
                ].pet = url;

                setGuideData(next);
              }}
            />
          </div>
        </div>

        <div
          className="
            flex gap-8
            flex-wrap
          "
        >
          {deck.skills.map(
            (
              skill: string,
              skillIndex: number
            ) => (
              <SkillBox
                key={skillIndex}
                defense
                image={skill}
                onChange={(url) => {
                  const next = {
                    ...guideData,
                  };

                  next.defense[
                    index
                  ].skills[
                    skillIndex
                  ] = url;

                  setGuideData(
                    next
                  );
                }}
              />
            )
          )}
        </div>
      </div>

      <div
        className="
          border border-red-700
          rounded-lg

          bg-[#111]

          p-3
          mt-5

          min-h-[180px]
        "
      >
        <div
          className="
            text-red-500
            font-bold
            text-[18px]

            mb-2
          "
        >
          TIP.
        </div>

        <Editable
          value={deck.tip}
          onChange={(v) => {
            const next = {
              ...guideData,
            };

            next.defense[index].tip =
              v;

            setGuideData(next);
          }}
          className="
            text-gray-300
            text-[13px]

            w-full
          "
        />
      </div>
    </div>
  );

  return (
    <div
      className="
        w-screen h-screen

        bg-black
        text-white

        p-[8px]

        flex flex-col
        gap-[8px]

        overflow-hidden
      "
    >
      {!isAdmin && (
        <div
          className="
            fixed inset-0

            bg-black/90

            z-50

            flex items-center justify-center

            p-4
          "
        >
          <div
            className="
              border border-red-700
              rounded-xl

              bg-[#111]

              p-6

              w-full
              max-w-[320px]

              flex flex-col gap-4
            "
          >
            <div
              className="
                text-red-500
                text-[24px]
                font-bold

                text-center
              "
            >
              관리자 로그인
            </div>

            <input
              type="password"
              placeholder="비밀번호 입력"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              className="
                bg-black

                border border-red-700
                rounded-lg

                px-3 py-2

                outline-none
              "
            />

            <button
              onClick={login}
              className="
                bg-red-700
                hover:bg-red-600

                transition

                rounded-lg

                py-2

                font-bold
              "
            >
              로그인
            </button>
          </div>
        </div>
      )}

      {/* Header */}
            {/* Header */}
            <div
        className="
          border border-red-700
          rounded-xl

          px-3 py-2

          flex items-center justify-between

          shrink-0

          flex-wrap gap-3
        "
      >
        <div
          className="
            flex items-center gap-3
          "
        >
          <label className="cursor-pointer shrink-0">
            {guideData.logo ? (
              <img
                src={guideData.logo}
                className="
                  h-[64px]
                  object-contain
                "
              />
            ) : (
              <div
                className="
                  h-[64px]
                  w-[64px]

                  border border-red-700

                  flex items-center justify-center

                  text-[11px]
                  text-gray-400
                "
              >
                로고
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file =
                  e.target.files?.[0];

                if (!file) return;

                const {
                  ref: storageRef,
                  uploadBytes,
                  getDownloadURL,
                } = await import(
                  "firebase/storage"
                );

                const imageRef =
                  storageRef(
                    storage,
                    `logo/${Date.now()}-${file.name}`
                  );

                await uploadBytes(
                  imageRef,
                  file
                );

                const url =
                  await getDownloadURL(
                    imageRef
                  );

                setGuideData({
                  ...guideData,
                  logo: url,
                });
              }}
            />
          </label>

          <Editable
            value={guideData.title}
            onChange={(v) =>
              setGuideData({
                ...guideData,
                title: v,
              })
            }
            className="
              text-[22px]
              md:text-[34px]

              font-bold

              min-w-0
              w-full
            "
          />
        </div>

        <div
          className="
            flex items-center gap-2
          "
        >
          <Editable
            value={guideData.nickname}
            onChange={(v) =>
              setGuideData({
                ...guideData,
                nickname: v,
              })
            }
            className="
              text-red-500
              text-[18px]
              md:text-[20px]

              font-bold

              w-[120px]
            "
          />

          <button
            onClick={saveData}
            className="
              bg-red-700

              px-3 py-1

              rounded-md

              text-[12px]
              font-bold
            "
          >
            저장
          </button>

          <button
            onClick={logout}
            className="
              border border-red-700

              px-3 py-1

              rounded-md

              text-[12px]
              font-bold
            "
          >
            로그아웃
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div
        className="
          flex gap-2

          shrink-0

          overflow-x-auto
        "
      >
        {guideData.tabs.map(
          (
            tab,
            index
          ) => (
            <button
              key={index}
              onClick={() =>
                setActiveTab(
                  index
                )
              }
              className={`
                border border-red-700
                rounded-md

                px-5 py-1

                text-[13px]
                font-bold

                shrink-0

                ${
                  activeTab ===
                  index
                    ? "bg-red-700"
                    : "bg-black"
                }
              `}
            >
              {tab}
            </button>
          )
        )}

        <button
          onClick={addTab}
          className="
            border border-red-700
            rounded-md

            px-4 py-1

            text-[15px]
            font-bold
          "
        >
          +
        </button>
      </div>

      {/* Main */}
      <div
        className="
          flex-1

          flex flex-col
          lg:flex-row

          gap-[10px]

          min-h-0

          overflow-auto
        "
      >
        {/* Defense */}
        <div
          className="
            w-full
            lg:w-[25%]

            flex flex-col gap-[10px]
          "
        >
          {guideData.defense.map(
            (
              deck,
              index
            ) => (
              <DefenseDeck
                key={index}
                deck={deck}
                index={index}
              />
            )
          )}
        </div>

        {/* Attack */}
        <div
          className="
            flex-1

            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-3

            gap-[10px]
          "
        >
          {guideData.attack.map(
            (
              deck,
              index
            ) => (
              <AttackDeck
                key={index}
                deck={deck}
                index={index}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}