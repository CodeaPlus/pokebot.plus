export interface Pokemon {
  height: number;
  id: number;
  name: string;
  order: number;
  sprites: Sprites;
  types: Type[];
  weight: number;
  flavors: Flavor[];
}

export interface Sprites {
  front_default: string;
  front_shiny: string;
}

export interface Type {
  slot: number;
  name: string;
}

export interface Flavor {
  language: string;
  text: string;
}