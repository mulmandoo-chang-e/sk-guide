'use client';

import { useEffect, useState } from 'react';
import { db } from "./firebase";
import { ref, set, onValue } from "firebase/database";

export default function SevenKnightsGuide() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  const [tabs, setTabs] = useState(['덱 1', '덱 2', '덱 3', '덱 4', '덱 5']);
  const [guideData, setGuideData] = useState<any>({});

  useEffect(() => {
    const savedAdmin = localStorage.getItem('sk-admin');
    const savedTabs = localStorage.getItem('sk-tabs');

    if (savedAdmin === 'true') {
      setIsAdmin(true);
    }

    if (savedTabs) {
      setTabs(JSON.parse(savedTabs));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sk-tabs', JSON.stringify(tabs));
  }, [tabs]);

  useEffect(() => {
    const guideRef = ref(db, "guideData");
  
    onValue(guideRef, (snapshot) => {
      const data = snapshot.val();
  
      if (data) {
        setGuideData(data);
      }
    });
  }, []);

  const login = () => {
    if (password === '1234') {
      setIsAdmin(true);
      localStorage.setItem('sk-admin', 'true');
    }
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem('sk-admin');
  };

  const saveData = async () => {
    await set(ref(db, "guideData"), guideData);
    alert("저장 완료");
  };

  const addDeck = () => {
    if (tabs.length >= 8) return;

    setTabs([...tabs, `덱 ${tabs.length + 1}`]);
  };

  const Editable = ({
    children,
    className = '',
  }: {
    children: any;
    className?: string;
  }) => (
    <div
      contentEditable={isAdmin}
      suppressContentEditableWarning
      className={className}
    >
      {children}
    </div>
  );

  const HeroBox = ({
    label,
    pet = false,
    defense = false,
  }: {
    label: string;
    pet?: boolean;
    defense?: boolean;
  }) => {
    const [image, setImage] = useState<string | null>(null);

    const size = defense
      ? pet
        ? 'w-[54px] h-[54px]'
        : 'w-[92px] h-[92px]'
      : pet
      ? 'w-[48px] h-[48px]'
      : 'w-[78px] h-[78px]';

    const desc = defense
      ? pet
        ? 'w-[54px]'
        : 'w-[92px]'
      : pet
      ? 'w-[48px]'
      : 'w-[78px]';

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
            <img src={image} className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-500 text-[10px]">이미지</span>
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
          className={`
            ${desc}
            h-[18px]
            border border-red-600 rounded-sm bg-[#111]
            flex items-center justify-center text-white text-[9px]
          `}
        >
          설명 입력
        </Editable>
      </div>
    );
  };
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
          <img src={logo} alt="로고" className="w-full h-full object-contain" />
        ) : (
          <div className="text-gray-500 text-[12px]">로고 업로드</div>
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
  const SkillBox = ({ defense = false }: { defense?: boolean }) => {
    const size = defense ? 'w-[72px] h-[72px]' : 'w-[62px] h-[62px]';

    const desc = defense ? 'w-[72px]' : 'w-[62px]';

    return (
      <div className="flex flex-col items-center gap-[4px] shrink-0">
        <div
          className={`
            ${size}
            border border-red-600 rounded-md bg-[#111]
            flex items-center justify-center text-gray-500 text-[10px]
          `}
        >
          이미지
        </div>

        <Editable
          className={`
            ${desc}
            h-[18px]
            border border-red-600 rounded-sm bg-[#111]
            flex items-center justify-center text-white text-[9px]
          `}
        >
          설명 입력
        </Editable>
      </div>
    );
  };

  const AttackDeck = ({ title }: { title: string }) => (
    <div className="border border-red-700 rounded-xl bg-black p-3 flex flex-col gap-4 min-h-[300px]">
      <Editable className="text-red-500 text-[22px] font-bold">
        {title}
      </Editable>

      <div className="flex items-start gap-4 flex-wrap">
        <div className="flex gap-3">
          <HeroBox label="영웅" />
          <HeroBox label="영웅" />
          <HeroBox label="영웅" />
        </div>

        <div className="pt-[10px]">
          <HeroBox label="펫" pet />
        </div>
      </div>

      <div className="flex gap-6 flex-wrap">
        <SkillBox />
        <SkillBox />
        <SkillBox />
      </div>

      <div className="border border-red-700 rounded-lg bg-[#111] p-3 mt-auto">
        <div className="text-red-500 font-bold text-[15px] mb-1">TIP.</div>

        <Editable className="text-gray-300 text-[12px] min-h-[28px]">
          운영법을 입력하세요.
        </Editable>
      </div>
    </div>
  );

  const DefenseDeck = ({ title }: { title: string }) => (
    <div className="border border-red-700 rounded-xl bg-black p-4 flex flex-col justify-between min-h-[49%]">
      <div className="flex flex-col gap-6">
        <Editable className="text-red-500 text-[28px] font-bold">
          {title}
        </Editable>

        <div className="flex items-start gap-5 flex-wrap">
          <div className="flex gap-4">
            <HeroBox label="영웅 이미지" defense />
            <HeroBox label="영웅 이미지" defense />
            <HeroBox label="영웅 이미지" defense />
          </div>

          <div className="pt-[12px]">
            <HeroBox label="펫" pet defense />
          </div>
        </div>

        <div className="flex gap-8 flex-wrap">
          <SkillBox defense />
          <SkillBox defense />
          <SkillBox defense />
        </div>
      </div>

      <div className="border border-red-700 rounded-lg bg-[#111] p-3 h-[32%] mt-5">
        <div className="text-red-500 font-bold text-[18px] mb-2">TIP.</div>

        <Editable className="text-gray-300 text-[13px] min-h-[40px]">
          운영법을 입력하세요.
        </Editable>
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

      <div className="border border-red-700 rounded-xl px-3 py-2 flex items-center justify-between shrink-0 flex-wrap gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <LogoUpload />

          <Editable className="text-[22px] md:text-[34px] font-bold truncate">
            세븐나이츠 리버스 길드전 가이드
          </Editable>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-end">
          <Editable className="text-red-500 text-[18px] md:text-[20px] font-bold">
            지약새
          </Editable>

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

      <div className="flex gap-2 shrink-0 overflow-x-auto pb-1">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={`
              border border-red-700 rounded-md px-5 py-1 text-[13px] font-bold shrink-0
              ${
                activeTab === i
                  ? 'bg-red-700 text-white'
                  : 'bg-black text-white'
              }
            `}
          >
            {tab}
          </button>
        ))}

        <button
          onClick={addDeck}
          className="border border-red-700 rounded-md px-4 py-1 text-[15px] font-bold shrink-0"
        >
          +
        </button>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 gap-[10px] min-h-0">
        <div className="w-full lg:w-[25%] flex flex-col gap-[10px] lg:justify-between">
          <DefenseDeck title="방어덱 1" />
          <DefenseDeck title="방어덱 2" />
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[10px]">
          <AttackDeck title="공격덱 1" />
          <AttackDeck title="공격덱 2" />
          <AttackDeck title="공격덱 3" />
          <AttackDeck title="공격덱 4" />
          <AttackDeck title="공격덱 5" />
          <AttackDeck title="공격덱 6" />
          <AttackDeck title="공격덱 7" />
          <AttackDeck title="공격덱 8" />
          <AttackDeck title="공격덱 9" />
        </div>
      </div>
    </div>
  );
}
