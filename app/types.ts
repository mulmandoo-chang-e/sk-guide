export type DeckData = {
  title: string;

  tip: string;

  heroes: string[];

  heroDescriptions: string[];

  skills: string[];

  skillDescriptions: string[];

  pet: string;
};
  
export type GuideData = {
  logo: string;

  title: string;

  nickname: string;

  tabs: {
    name: string;

    attack: DeckData[];

    defense: DeckData[];
  }[];
};