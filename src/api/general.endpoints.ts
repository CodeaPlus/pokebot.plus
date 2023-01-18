import { pokeGraphQL } from "./pokeApi";
import { operationPokemonDaily } from "./graph-queries";
import { DailyPokemon } from "src/domain/pokemon.interface";

export interface RequestError {
  response: {
    status: number;
  },
  title: string,
  message: string
}

const getError = ({ title, message, response }: RequestError): RequestError => ({ title, message, response })

const getDailyPokemon = async (day: number, month: number): Promise<DailyPokemon> => {
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

    return data.daily[0];
  } catch (error) {
    throw getError(error as RequestError)
  }
}

export const GeneralEndpoints = {
  getDailyPokemon
}
