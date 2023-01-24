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

export const getPokeUserCard = `
  query PokeGet($where: user_cards_bool_exp) {
    userCards: user_cards(where: $where) {
      attachmentId
      avatarUrl
      day
      discordUserId
      id
      image
      month
      pokemonId
      type
      username
    }
  }
`;

export const insertPokeUserCard = `
  mutation PokeUpdate($object: user_cards_insert_input!) {
    userCard: insert_user_cards_one(object: $object) {
      attachmentId
      avatarUrl
      day
      discordUserId
      id
      image
      month
      pokemonId
      type
      username
    }
  }
`;