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

  heroDescriptions: ["", "", ""],

  pet: "",

  skills: ["", "", ""],

  skillDescriptions: ["", "", ""],
});

const defaultGuideData: GuideData = {
  logo: "",

  title: "세븐나이츠 리버스 길드전 가이드",

  nickname: "지약새",

  tabs: [
    {
      name: "덱 1",

      attack: Array.from(
        { length: 9 },
        (_, i) =>
          createDeck(
            `공격덱 ${i + 1}`
          )
      ),
  
      defense: Array.from(
        { length: 2 },
        (_, i) =>
          createDeck(
            `방어덱 ${i + 1}`
          )
      ),
    },
  
    {
      name: "덱 2",

      attack: Array.from(
        { length: 9 },
        (_, i) =>
          createDeck(
            `공격덱 ${i + 1}`
          )
      ),
  
      defense: Array.from(
        { length: 2 },
        (_, i) =>
          createDeck(
            `방어덱 ${i + 1}`
          )
      ),
    },
  
    {
      name: "덱 3",

      attack: Array.from(
        { length: 9 },
        (_, i) =>
          createDeck(
            `공격덱 ${i + 1}`
          )
      ),
  
      defense: Array.from(
        { length: 2 },
        (_, i) =>
          createDeck(
            `방어덱 ${i + 1}`
          )
      ),
    },
  
    {
      name: "덱 4",

      attack: Array.from(
        { length: 9 },
        (_, i) =>
          createDeck(
            `공격덱 ${i + 1}`
          )
      ),
  
      defense: Array.from(
        { length: 2 },
        (_, i) =>
          createDeck(
            `방어덱 ${i + 1}`
          )
      ),
    },
  
    {
      name: "덱 5",

      attack: Array.from(
        { length: 9 },
        (_, i) =>
          createDeck(
            `공격덱 ${i + 1}`
          )
      ),
  
      defense: Array.from(
        { length: 2 },
        (_, i) =>
          createDeck(
            `방어덱 ${i + 1}`
          )
      ),
    },
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

    useEffect(() => {
      if (
        activeTab >=
        guideData.tabs.length
      ) {
        setActiveTab(0);
      }
    }, [activeTab, guideData.tabs.length]);

  const [isAdmin, setIsAdmin] =
    useState(false);

  const [password, setPassword] =
    useState("");

  const [darkMode, setDarkMode] =
    useState(false);

  /* Firebase Load */
  useEffect(() => {
    const guideRef =
      ref(db, "guideData");

    onValue(
      guideRef,
      (snapshot) => {
        const data = snapshot.val();

        if (data) {
          // setGuideData(data);
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
      
        {
          name: `덱 ${guideData.tabs.length + 1}`,
      
          attack: Array.from(
            { length: 9 },
            (_, i) =>
              createDeck(
                `공격덱 ${i + 1}`
              )
          ),
      
          defense: Array.from(
            { length: 2 },
            (_, i) =>
              createDeck(
                `방어덱 ${i + 1}`
              )
          ),
        },
      ],
    });

    setActiveTab(
      guideData.tabs.length
    );
  };

  /* Attack Deck */
  const AttackDeck = ({
    deck,
    index,
  }: any) => (
    <div
    className={`
  relative overflow-hidden

  rounded-xl

  p-4

  flex flex-col

  gap-4

  transition-all duration-200

  ${
    darkMode
        ? `
        bg-[linear-gradient(to_bottom,#181818,#0f0f0f)]

        shadow-[0_0_25px_rgba(255,0,0,0.08)]
        
        backdrop-blur-md
  
          border border-red-700/60
  
          shadow-[0_0_30px_rgba(120,0,0,0.16)]
        `
        : `
        bg-[linear-gradient(to_bottom,#ffffff,#f3f8ff)]

        shadow-[0_4px_18px_rgba(59,130,246,0.08)]
        
        backdrop-blur-md
  
          border border-gray-300
  
          shadow-sm
        `
    }
  `}
    >
      <Editable
        value={deck.title}
        onChange={(v) => {
          const next = {
            ...guideData,
          };

          next.tabs[activeTab]
          .attack[index].title =
            v;

          setGuideData(next);
        }}
        className={`
  font-bold
  text-[22px]

  ${
    darkMode
      ? "text-red-500"
      : "text-blue-600"
  }
`}
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

        description={
          deck.heroDescriptions?.[heroIndex] || ""
        }

        onDescriptionChange={(v) => {
          const next = {
            ...guideData,
          };
        
          if (
            !next.tabs[activeTab]
            .attack[index]
              .heroDescriptions
          ) {
            next.tabs[activeTab]
            .attack[index]
              .heroDescriptions =
                ["", "", "", ""];
          }
        
          next.tabs[activeTab]
          .attack[index]
            .heroDescriptions[heroIndex] = v;
        
          setGuideData(next);
        }}

        darkMode={darkMode}

        onChange={(url) => {
          const next = {
            ...guideData,
          };

          next.tabs[activeTab]
  .attack[index]
            .heroes[heroIndex] = url;

          setGuideData(next);
        }}
      />
    )
  )}
</div>

        <div className="pt-[10px]">
          <HeroBox darkMode={darkMode}
            pet
            image={deck.pet}
            onChange={(url) => {
              const next = {
                ...guideData,
              };

              next.tabs[activeTab]
              .attack[
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
            darkMode={darkMode}
          
          
            image={skill}

  description={
    deck.skillDescriptions?.[skillIndex] || ""
  }

  onDescriptionChange={(v) => {
    const next = {
      ...guideData,
    };
  
    if (
      !next.tabs[activeTab]
      .attack[index]
        .skillDescriptions
    ) {
      next.tabs[activeTab]
      .attack[index]
        .skillDescriptions =
          ["", "", "", ""];
    }
  
    next.tabs[activeTab]
    .attack[index]
      .skillDescriptions[skillIndex] = v;
  
    setGuideData(next);
  }}


              onChange={(url) => {
                const next = {
                  ...guideData,
                };

                next.tabs[activeTab]
                .attack[
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
        className={`
        rounded-lg
      
        p-3
      
        transition-all duration-200
      
        ${
          darkMode
            ? `
              bg-[#111]
      
              border border-red-700/60
            `
            : `
              bg-[#f8fafc]
      
              border border-blue-200
            `
        }
      `}
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

            next.tabs[activeTab]
            .attack[index].tip =
              v;

            setGuideData(next);
          }}
          className={`
  ${
    darkMode
      ? "text-gray-300"
      : "text-black"
  }

  text-[15px]
  leading-relaxed

  w-full
`}
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
    className={`
    relative overflow-hidden
  
    rounded-xl
  
    p-4
  
    flex flex-col
  
    gap-4
  
    transition-all duration-200
  
    ${
      darkMode
          ? `
          bg-[linear-gradient(to_bottom,#181818,#0f0f0f)]

          shadow-[0_0_25px_rgba(255,0,0,0.08)]
          
          backdrop-blur-md
    
            border border-red-700/60
    
            shadow-[0_0_30px_rgba(120,0,0,0.16)]
          `
          : `
          bg-[linear-gradient(to_bottom,#ffffff,#f3f8ff)]

          shadow-[0_4px_18px_rgba(59,130,246,0.08)]
          
          backdrop-blur-md
    
            border border-gray-300
    
            shadow-sm
          `
      }
    `}
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

            next.tabs[activeTab]
  .defense[index]
              .title = v;

            setGuideData(next);
          }}
          className={`
  font-bold
  text-[28px]

  ${
    darkMode
      ? "text-red-500"
      : "text-blue-600"
  }
`}
        />

        <div
          className="
            flex items-start gap-5
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
      defense

        key={heroIndex}

        image={hero}

        description={
          deck.heroDescriptions?.[heroIndex] || ""
        }

        onDescriptionChange={(v) => {
          const next = {
            ...guideData,
          };
        
          if (
            !next.tabs[activeTab]
            .defense[index]
              .heroDescriptions
          ) {
            next.tabs[activeTab]
            .defense[index]
              .heroDescriptions =
                ["", "", "", ""];
          }
        
          next.tabs[activeTab]
          .defense[index]
            .heroDescriptions[heroIndex] = v;
        
          setGuideData(next);
        }}

        darkMode={darkMode}

        onChange={(url) => {
          const next = {
            ...guideData,
          };

          next.tabs[activeTab]
          .defense[index]
            .heroes[heroIndex] = url;

          setGuideData(next);
        }}
      />
    )
  )}
</div>

          <div className="pt-[12px]">
            <HeroBox darkMode={darkMode}
              pet
              defense
              image={deck.pet}
              onChange={(url) => {
                const next = {
                  ...guideData,
                };

                next.tabs[activeTab]
                .defense[
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
  darkMode={darkMode}

  defense

  image={skill}

  description={
    deck.skillDescriptions?.[skillIndex] || ""
  }

  onDescriptionChange={(v) => {
    const next = {
      ...guideData,
    };
  
    if (
      !next.tabs[activeTab]
      .defense[index]
        .skillDescriptions
    ) {
      next.tabs[activeTab]
      .defense[index]
        .skillDescriptions =
          ["", "", "", ""];
    }
  
    next.tabs[activeTab]
    .defense[index]
      .skillDescriptions[skillIndex] = v;
  
    setGuideData(next);
  }}


                onChange={(url) => {
                  const next = {
                    ...guideData,
                  };

                  next.tabs[activeTab]
                  .defense[
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
       className={`
       rounded-lg
     
       p-3
     
       mt-5
     
       min-h-[160px]
     
       transition-all duration-200
     
       ${
         darkMode
           ? `
             bg-[#111]
     
             border border-red-700/60
           `
           : `
             bg-[#f8fafc]
     
             border border-blue-200
           `
       }
     `}
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

            next.tabs[activeTab]
            .defense[index].tip =
              v;

            setGuideData(next);
          }}
          className={`
  ${
    darkMode
      ? "text-gray-300"
      : "text-black"
  }

  text-[24px]
  leading-relaxed

  w-full
`}
        />
      </div>
    </div>
  );

  return (
    <div
    className={`
  w-screen h-screen

  ${
    darkMode
      ? `
        bg-[radial-gradient(circle_at_top,rgba(120,0,0,0.15),transparent_35%),linear-gradient(to_bottom,#050505,#0a0a0a,#120808)]

        text-white
      `
      : `
    bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.08),transparent_35%),linear-gradient(to_bottom,#f8fbff,#eef4ff,#e9f1ff)]

    text-black
  `
  }

  p-[8px]

  flex flex-col
  gap-[8px]

  overflow-hidden
`}
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

<div
  className={`
  rounded-xl

  px-3 py-2

  flex items-center justify-between

  shrink-0

  flex-wrap gap-3

  transition-all duration-200

  ${
    darkMode
      ? `
        border border-red-700/60

        bg-[linear-gradient(to_bottom,#111111,#050505)]

backdrop-blur-xl

shadow-[0_0_30px_rgba(255,0,0,0.08)]

        text-white
      `
      : `
        border border-gray-300

        bg-white/75

        backdrop-blur-xl
        
        shadow-[0_8px_24px_rgba(59,130,246,0.10)]

        text-black
      `
  }
`}
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
            className={`
  ${
    darkMode
      ? "text-red-500"
      : "text-blue-700"
  }

  text-[18px]
  md:text-[20px]

  font-bold

  w-[320px]
`}
          />

<button
  onClick={() =>
    setDarkMode(!darkMode)
  }
  className={`
    px-3 py-1

    rounded-md

    text-[12px]

    font-bold

    transition-all duration-200

    ${
      darkMode
        ? `
          bg-[#111]

          border border-red-700

          text-white
        `
        : `
          bg-white

          border border-gray-300

          text-gray-700
        `
    }
  `}
>
  {darkMode ? "LIGHT" : "DARK"}
</button>

          <button
            onClick={saveData}
            className={`
  px-3 py-1

  rounded-md

  text-[12px]

  font-bold

  transition-all duration-200

  ${
    darkMode
      ? `
        bg-red-700

        text-white
      `
      : `
        bg-blue-600

        text-white
      `
  }
`}
          >
            저장
          </button>

          <button
            onClick={logout}
            className={`
  px-3 py-1

  rounded-md

  text-[12px]

  font-bold

  transition-all duration-200

  ${
    darkMode
      ? `
        border border-red-700

        bg-black

        text-white
      `
      : `
        border border-gray-300

        bg-white

        text-gray-700
      `
  }
`}
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
              onClick={(e) => {
                if (
                  (e.target as HTMLElement).tagName !== "INPUT"
                ) {
                  setActiveTab(index);
                }
              }}
              className={`
  ${
    darkMode
      ? "border border-red-700"
      : "border border-blue-200"
  }

  rounded-md

                px-5 py-1

                text-[13px]
                font-bold

                shrink-0

                ${
                  activeTab === index
                    ? darkMode
                      ? `
                        bg-gradient-to-b
                        from-red-600
                        to-red-900
                
                        border-red-500
                
                        text-white
                
                        shadow-[0_0_20px_rgba(180,0,0,0.35)]
                      `
                      : `
                        bg-gradient-to-b
                        from-blue-500
                        to-blue-700
                
                        border-blue-400
                
                        text-white
                
                        shadow-[0_0_18px_rgba(59,130,246,0.35)]
                      `
                    : darkMode
                      ? `
                        bg-[#0d0d0d]
                
                        border-red-900/70
                
                        text-white/90
                
                        hover:bg-[#171717]
                
                        hover:border-red-700/80
                      `
                      : `
                        bg-white
                
                        border-gray-300
                
                        text-gray-700
                
                        hover:bg-blue-50
                
                        hover:border-blue-300
                      `
                }
              `}
            >
              <Editable
  value={tab.name}
  onChange={(v) => {
    const next = {
      ...guideData,
    };

    next.tabs[index].name = v;

    setGuideData(next);
  }}
  className="
    text-center

    bg-transparent

    w-20
  "
/>
            </button>
          )
        )}

<button
  onClick={addTab}
  className={`
    rounded-lg

    px-4 py-1

    border

    text-[14px]
    font-bold

    transition-all duration-200

    ${
       darkMode
  ? `
    bg-[#0d0d0d]

    border-red-900/70

    text-white/90

    hover:bg-[#171717]

    hover:border-red-700/80
  `
  : `
    bg-white

    border-blue-200

    text-gray-700

    hover:bg-blue-50

    hover:border-blue-400
  `
    }
  `}
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
          {guideData.tabs[
  activeTab
]?.defense?.map(
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
            lg:grid-cols-3

            gap-[10px]

            pr-[4px]
          "
        >
          {guideData.tabs[
  activeTab
]?.attack?.map(
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