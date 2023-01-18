export interface DailyPokemon {
  month: number;
  id: number;
  day: number;
  pokemon: Pokemon;
}

export interface Pokemon {
  height: number;
  id: number;
  name: string;
  order: number;
  types: Type[];
  weight: number;
  sprites: Sprite[];
  flavors: Flavor[];
}

export interface Flavor {
  id: number;
  language: string;
  text: string;
}

export interface Sprite {
  frontDefault: string;
  frontShiny: string;
}

export interface Type {
  id: number;
  color: string;
  name: string;
}

export const languages = [{
  name: "English",
  value: "en"
}, {
  name: "Spanish",
  value: "es"
}, {
  name: "Japanese",
  value: "ja"
}]