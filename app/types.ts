export type DeckData = {
    title: string;
    tip: string;
  
    heroes: string[];
    pet: string;
  
    skills: string[];
  };
  
  export type GuideData = {
    logo: string;
  
    title: string;
    nickname: string;
  
    tabs: string[];
  
    attack: DeckData[];
    defense: DeckData[];
  };