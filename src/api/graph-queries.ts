export const operationPokemonDaily = `
  query MyQuery($where: daily_pokemon_view_bool_exp) {
    daily: daily_pokemon_view(where: $where) {
      day
      flavors
      height
      id
      isShiny: is_shiny
      month
      name
      order
      sprites
      types
      weight
    }
  }
`;

export const operationPokemonRandom = `
  query MyQuery {
    randomPokemon: random_pokemon {
      flavors
      height
      id
      isShiny: is_shiny
      name
      order
      sprites
      types
      weight
    }
  }
`;