export const operationPokemonDaily = `
  query MyQuery($where: daily_pokemon_bool_exp) {
    daily: daily_pokemon(limit: 1, where: $where) {
      month
      day
      pokemon {
        height
        id
        name
        order
        types {
          color
          name
        }
        weight
        sprites {
          frontDefault: front_default
          frontShiny: front_shiny
        }
        flavors {
          language
          text
        }
      }
    }
  }
`;