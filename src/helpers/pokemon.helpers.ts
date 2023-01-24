import chroma from "chroma-js";
import nodeHtmlToImage from "node-html-to-image";
import { Pokemon } from "../domain/pokemon.interface";
import { getShinyChance, getPattern, getColor, getHeight, getWeight, getTypes, getFlavorText } from "../utils/pokemon.utils";

export const getPokemonImage = async (day: string, monthName: string, authorName: string, authorAvatar: string, languageValue: string, pokemon: Pokemon) => {
  const pokemonName = pokemon.name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const pokemonNameNoDash = pokemonName.replace("-", " ");

  const image = await nodeHtmlToImage({
    transparent: true,
    html: `
      <html>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Roboto', sans-serif;
            font-weight: 400;
            height: 768px;
            position: relative;
            width: 1471px;
          }
          .overlay {
            background-image: url({{pattern}});
            inset: 0;
            position: absolute;
            z-index: 1;
          }
          img.pokemon {
            position: absolute;
            height: 100%;
            right: 0;
            top: 0;
            z-index: 30;
          }
          .user-data {
            background-color: {{opaqueColor}};
            align-items: center;
            color: #FFF;
            font-size: 3rem;
            display: flex;
            gap: 1rem;
            line-height: 1;
            left: 0;
            padding: 2rem;
            position: absolute;
            text-align: left;
            font-weight: 900;
            bottom: 2rem;
            width: calc(100% - 4rem);
            text-transform: uppercase;
            z-index: 9;
          }
          .user-data .avatar {
            border-radius: 50%;
          }
          .user-data .author {
            font-size: 2.5rem
          }
          .user-data .birthday {
            font-size: 4rem
          }
          .pokemon-data {
            border-radius: 1rem;
            background-color: rgb(0 0 0 / 60%);
            padding: 2rem;
            color: #FFF;
            font-size: 1.25rem;
            display: flex;
            flex-direction: column;
            gap: 1rem;
            line-height: 1;
            left: 2rem;
            position: absolute;
            text-align: left;
            font-weight: 500;
            top: 5rem;
            width: 30rem;
            z-index: 9;
          }
          .pokemon-data .name {
            font-size: 3.5rem;
            font-weight: 900;
            text-transform: uppercase;
            width: 80%;
          }
          .pokemon-data .stats {
            display: flex;
            flex-direction: column;
            gap: .5rem;
          }
          .pokemon-data .stats p {
            line-height: 1.25;
            width: calc(100% - 4rem);
          }
        </style>
      </head>
      <body>
        <div class="overlay"></div>
        <div class="pokemon-data">
          <div class="name">{{name}}</div>

          <div class="stats">
            <div class="stats-item">
              <strong>Type:</strong> {{types}}
            </div>
            <div class="stats-item">
              <strong>Height:</strong> {{height}} m
            </div>
            <div class="stats-item">
              <strong>Weight:</strong> {{weight}} kg
            </div>
            
            <p>{{flavor}}</p>
          </div>
        </div>
        <div class="user-data">
          <img class="avatar" src="{{authorAvatar}}" width="120" height="120" />
          <div class="name">
            <div class="author">{{authorName}}</div>
            <div class="birthday">{{birthday}}</div>
          </div>
        </div>
        <img class="pokemon" src="{{imageSource}}" />
      </body>
      </html>
    `,
    content: {
      imageSource: getShinyChance(pokemon),
      pattern: getPattern(pokemon),
      authorName: authorName,
      name: pokemonNameNoDash,
      color: getColor(pokemon),
      birthday: `${monthName} ${day}`,
      height: getHeight(pokemon),
      weight: getWeight(pokemon),
      types: getTypes(pokemon),
      flavor: getFlavorText(pokemon, languageValue),
      authorAvatar: authorAvatar,
      opaqueColor: chroma(getColor(pokemon)).alpha(.75).css(),
    },
    puppeteerArgs: { args: ['--no-sandbox'] }
  });

  return {
    image,
    pokemonName: pokemonNameNoDash,
    types: getTypes(pokemon),
  };
}