"use client";

import { useEffect, useState } from "react";
import { db } from "./firebase";
import { ref, set, onValue } from "firebase/database";

const defaultTabs = [
  "덱 1",
  "덱 2",
  "덱 3",
  "덱 4",
  "덱 5",
];

const createDeck = (title: string) => ({
  title,
  tip: "",
});

const createGuideData = () => ({
  tabs: defaultTabs,

  defense: [
    createDeck("방어덱 1"),
    createDeck("방어덱 2"),
  ],

  attack: Array.from({ length: 9 }, (_, i) =>
    createDeck(`공격덱 ${i + 1}`)
  ),
});

export default function SevenKnightsGuide() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState("");

  const [guideData, setGuideData] = useState<any>(
    createGuideData()
  );

  const [activeTab, setActiveTab] = useState(0);

  /* Firebase Load */
  useEffect(() => {
    const guideRef = ref(db, "guideData");

    onValue(guideRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        setGuideData(data);
      }
    });
  }, []);

  /* Admin Login */
  useEffect(() => {
    const savedAdmin = localStorage.getItem("sk-admin");

    if (savedAdmin === "true") {
      setIsAdmin(true);
    }
  }, []);

  const login = () => {
    if (password === "1234") {
      setIsAdmin(true);
      localStorage.setItem("sk-admin", "true");
    }
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem("sk-admin");
  };

  /* Save */
  const saveData = async () => {
    await set(ref(db, "guideData"), guideData);
    alert("저장 완료");
  };

  /* Add Deck Tab */
  const addTab = () => {
    if (guideData.tabs.length >= 8) return;

    const nextTabs = [
      ...guideData.tabs,
      `덱 ${guideData.tabs.length + 1}`,
    ];

    setGuideData({
      ...guideData,
      tabs: nextTabs,
    });
  };

  /* Editable */
  const Editable = ({
    value,
    onChange,
    className = "",
  }: {
    value: string;
    onChange: (v: string) => void;
    className?: string;
  }) => (
    <div
      contentEditable={isAdmin}
      suppressContentEditableWarning
      onBlur={(e) => onChange(e.currentTarget.innerText)}
      className={className}
    >
      {value}
    </div>
  );

  /* Logo Upload */
  const LogoUpload = () => {
    const [logo, setLogo] = useState<string | null>(null);

    const uploadLogo = (e: any) => {
      const file = e.target.files?.[0];

      if (!file) return;

      const reader = new FileReader();

      reader.onloadend = () => {
        setLogo(reader.result as string);
      };

      reader.readAsDataURL(file);
    };

    return (
      <label className="w-[220px] h-[60px] flex items-center justify-center cursor-pointer shrink-0">
        {logo ? (
          <img
            src={logo}
            alt="로고"
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="text-gray-500 text-[12px]">
            로고 업로드
          </div>
        )}

        {isAdmin && (
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={uploadLogo}
          />
        )}
      </label>
    );
  };

  /* Hero Box */
  const HeroBox = ({
    pet = false,
    defense = false,
  }: {
    pet?: boolean;
    defense?: boolean;
  }) => {
    const [image, setImage] = useState<string | null>(null);

    const size = defense
      ? pet
        ? "w-[68px] h-[68px]"
        : "w-[108px] h-[108px]"
      : pet
      ? "w-[58px] h-[58px]"
      : "w-[88px] h-[88px]";

    const desc = defense
      ? pet
        ? "w-[68px]"
        : "w-[108px]"
      : pet
      ? "w-[58px]"
      : "w-[88px]";

    const uploadImage = (e: any) => {
      const file = e.target.files?.[0];

      if (!file) return;

      const reader = new FileReader();

      reader.onloadend = () => {
        setImage(reader.result as string);
      };

      reader.readAsDataURL(file);
    };

    return (
      <div className="flex flex-col items-center gap-[4px] shrink-0">
        <label
          className={`
            ${size}
            border border-red-600 rounded-md bg-[#111]
            overflow-hidden cursor-pointer
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

          {isAdmin && (
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={uploadImage}
            />
          )}
        </label>

        <Editable
          value="설명 입력"
          onChange={() => {}}
          className={`
            ${desc}
            h-[18px]
            border border-red-600 rounded-sm bg-[#111]
            flex items-center justify-center text-white text-[9px]
          `}
        />
      </div>
    );
  };

  /* Skill Box */
  const SkillBox = ({
    defense = false,
  }: {
    defense?: boolean;
  }) => {
    const [image, setImage] = useState<string | null>(null);

    const size = defense
      ? "w-[78px] h-[78px]"
      : "w-[66px] h-[66px]";

    const desc = defense
      ? "w-[78px]"
      : "w-[66px]";

    const uploadImage = (e: any) => {
      const file = e.target.files?.[0];

      if (!file) return;

      const reader = new FileReader();

      reader.onloadend = () => {
        setImage(reader.result as string);
      };

      reader.readAsDataURL(file);
    };

    return (
      <div className="flex flex-col items-center gap-[4px] shrink-0">
        <label
          className={`
            ${size}
            border border-red-600 rounded-md bg-[#111]
            overflow-hidden cursor-pointer
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

          {isAdmin && (
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={uploadImage}
            />
          )}
        </label>

        <Editable
          value="설명 입력"
          onChange={() => {}}
          className={`
            ${desc}
            h-[18px]
            border border-red-600 rounded-sm bg-[#111]
            flex items-center justify-center text-white text-[9px]
          `}
        />
      </div>
    );
  };
    /* Attack Deck */
    const AttackDeck = ({
      deck,
      index,
    }: {
      deck: any;
      index: number;
    }) => (
      <div className="border border-red-700 rounded-xl bg-black p-3 flex flex-col gap-4 min-h-[300px]">
        <Editable
          value={deck.title}
          onChange={(v) => {
            const next = { ...guideData };
  
            next.attack[index].title = v;
  
            setGuideData(next);
          }}
          className="text-red-500 text-[22px] font-bold"
        />
  
        <div className="flex items-start gap-4 flex-wrap">
          <div className="flex gap-3">
            <HeroBox />
            <HeroBox />
            <HeroBox />
          </div>
  
          <div className="pt-[10px]">
            <HeroBox pet />
          </div>
        </div>
  
        <div className="flex gap-6 flex-wrap">
          <SkillBox />
          <SkillBox />
          <SkillBox />
        </div>
  
        <div className="border border-red-700 rounded-lg bg-[#111] p-3 mt-auto">
          <div className="text-red-500 font-bold text-[15px] mb-1">
            TIP.
          </div>
  
          <Editable
            value={deck.tip}
            onChange={(v) => {
              const next = { ...guideData };
  
              next.attack[index].tip = v;
  
              setGuideData(next);
            }}
            className="text-gray-300 text-[12px] min-h-[32px]"
          />
        </div>
      </div>
    );
  
    /* Defense Deck */
    const DefenseDeck = ({
      deck,
      index,
    }: {
      deck: any;
      index: number;
    }) => (
      <div className="border border-red-700 rounded-xl bg-black p-4 flex flex-col justify-between min-h-[49%]">
        <div className="flex flex-col gap-6">
          <Editable
            value={deck.title}
            onChange={(v) => {
              const next = { ...guideData };
  
              next.defense[index].title = v;
  
              setGuideData(next);
            }}
            className="text-red-500 text-[28px] font-bold"
          />
  
          <div className="flex items-start gap-5 flex-wrap">
            <div className="flex gap-4">
              <HeroBox defense />
              <HeroBox defense />
              <HeroBox defense />
            </div>
  
            <div className="pt-[12px]">
              <HeroBox pet defense />
            </div>
          </div>
  
          <div className="flex gap-8 flex-wrap">
            <SkillBox defense />
            <SkillBox defense />
            <SkillBox defense />
          </div>
        </div>
  
        <div className="border border-red-700 rounded-lg bg-[#111] p-3 h-[32%] mt-5">
          <div className="text-red-500 font-bold text-[18px] mb-2">
            TIP.
          </div>
  
          <Editable
            value={deck.tip}
            onChange={(v) => {
              const next = { ...guideData };
  
              next.defense[index].tip = v;
  
              setGuideData(next);
            }}
            className="text-gray-300 text-[13px] min-h-[50px]"
          />
        </div>
      </div>
    );
  
    return (
      <div className="w-screen h-screen bg-black text-white p-[8px] flex flex-col gap-[8px] overflow-hidden">
        {!isAdmin && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="border border-red-700 rounded-xl bg-[#111] p-6 w-full max-w-[320px] flex flex-col gap-4">
              <div className="text-red-500 text-[24px] font-bold text-center">
                관리자 로그인
              </div>
  
              <input
                type="password"
                placeholder="비밀번호 입력"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-black border border-red-700 rounded-lg px-3 py-2 outline-none"
              />
  
              <button
                onClick={login}
                className="bg-red-700 hover:bg-red-600 transition rounded-lg py-2 font-bold"
              >
                로그인
              </button>
            </div>
          </div>
        )}
  
        {/* Header */}
        <div className="border border-red-700 rounded-xl px-3 py-2 flex items-center justify-between shrink-0 flex-wrap gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <LogoUpload />
  
            <Editable
              value="세븐나이츠 리버스 길드전 가이드"
              onChange={() => {}}
              className="text-[22px] md:text-[34px] font-bold truncate"
            />
          </div>
  
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <Editable
              value="지약새"
              onChange={() => {}}
              className="text-red-500 text-[18px] md:text-[20px] font-bold"
            />
  
            <button
              onClick={saveData}
              className="bg-red-700 px-3 py-1 rounded-md text-[12px] font-bold"
            >
              저장
            </button>
  
            <button
              onClick={logout}
              className="border border-red-700 px-3 py-1 rounded-md text-[12px] font-bold"
            >
              로그아웃
            </button>
          </div>
        </div>
  
        {/* Tabs */}
        <div className="flex gap-2 shrink-0 overflow-x-auto pb-1">
          {guideData.tabs.map((tab: string, i: number) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`
                border border-red-700 rounded-md px-5 py-1 text-[13px] font-bold shrink-0
                ${
                  activeTab === i
                    ? "bg-red-700 text-white"
                    : "bg-black text-white"
                }
              `}
            >
              {tab}
            </button>
          ))}
  
          {guideData.tabs.length < 8 && (
            <button
              onClick={addTab}
              className="border border-red-700 rounded-md px-4 py-1 text-[15px] font-bold shrink-0"
            >
              +
            </button>
          )}
        </div>
  
        {/* Main */}
        <div className="flex flex-col lg:flex-row flex-1 gap-[10px] min-h-0 overflow-auto">
          {/* Defense */}
          <div className="w-full lg:w-[25%] flex flex-col gap-[10px] lg:justify-between">
            {guideData.defense.map((deck: any, i: number) => (
              <DefenseDeck
                key={i}
                deck={deck}
                index={i}
              />
            ))}
          </div>
  
          {/* Attack */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[10px]">
            {guideData.attack.map((deck: any, i: number) => (
              <AttackDeck
                key={i}
                deck={deck}
                index={i}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }