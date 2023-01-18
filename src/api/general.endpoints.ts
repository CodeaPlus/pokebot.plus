import { pokeGraphQL } from "./pokeApi";
import { operationPokemonDaily, operationPokemonRandom } from './graph-queries';
import { Pokemon } from "src/domain/pokemon.interface";

export interface RequestError {
  response: {
    status: number;
  },
  title: string,
  message: string
}

const getError = ({ title, message, response }: RequestError): RequestError => ({ title, message, response })

const getDailyPokemon = async (day: number, month: number): Promise<Pokemon> => {
  try {
    const { data } = await pokeGraphQL(
      operationPokemonDaily,
      'MyQuery',
      {
        "where": {
          "day": { "_eq": day },
          "month": { "_eq": month },
        }
      }
    )

    // TODO: @Panda.dev - Improve this logic in backend
    data.daily[0].sprites = [{
      frontDefault: data.daily[0].sprites[0].front_default,
      frontShiny: data.daily[0].sprites[0].front_shiny
    }];

    return data.daily[0];
  } catch (error) {
    throw getError(error as RequestError)
  }
}

const getRandomPokemon = async (): Promise<Pokemon> => {
  try {
    const { data } = await pokeGraphQL(
      operationPokemonRandom,
      'MyQuery'
    )

    // TODO: @Panda.dev - Improve this logic in backend
    data.randomPokemon[0].sprites = [{
      frontDefault: data.randomPokemon[0].sprites[0].front_default,
      frontShiny: data.randomPokemon[0].sprites[0].front_shiny
    }];

    return data.randomPokemon[0];
  } catch (error) {
    throw getError(error as RequestError)
  }
}

export const GeneralEndpoints = {
  getDailyPokemon,
  getRandomPokemon
}
