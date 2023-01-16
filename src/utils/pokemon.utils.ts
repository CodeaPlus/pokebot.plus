import { Pokemon } from "src/domain/pokemon.interface";
import { POKEMON_TYPES } from "./pokemon-types";

export const getColor = (pokemon: Pokemon) => {
  const type = pokemon.types[0].name;
  return POKEMON_TYPES.filter(pokeType => pokeType.name === type)[0].color;
}

export const getShinyChance = (pokemon: Pokemon) => {
  const shinyChance = Math.floor(Math.random() * 100) + 1;
  return shinyChance <= 1 ? pokemon.sprites.front_shiny : pokemon.sprites.front_default;
}

export const getPattern = (pokemon: Pokemon) => {
  const type = pokemon.types[0].name;
  return `https://raw.githubusercontent.com/ddumst/pokecalendar-bot/master/src/assets/patterns/${type}-pattern.png`;
}

export const getFlavorText = (pokemon: Pokemon, language: string) => {
  const flavor = pokemon.flavors.filter(flavor => flavor.language === language)[0];
  return flavor.text;
}

export const getWeight = (pokemon: Pokemon) => {
  const weight = pokemon.weight / 10;
  return weight.toFixed(2);
}

export const getHeight = (pokemon: Pokemon) => {
  const height = pokemon.height / 10;
  return height.toFixed(2);
}

export const getTypes = (pokemon: Pokemon) => {
  const types = pokemon.types.map(type => type.name.charAt(0).toUpperCase() + type.name.slice(1));
  const typesString = types.join(' / ');
  return typesString;
}

export const regexDay = /^(0[1-9]|[12][0-9]|3[01])$/;
export const regexMonth = /^(0[1-9]|1[012])$/;