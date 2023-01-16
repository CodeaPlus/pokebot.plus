import { CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType, AttachmentBuilder } from "discord.js";
import { Command } from "../Command";
import nodeHtmlToImage from 'node-html-to-image';
import chroma from 'chroma-js';
import { Pokemon } from "src/domain/pokemon.interface";
import { POKEMON_TYPES } from '../utils/pokemon-types';

const languages = [{
	name: "English",
	value: "en"
}, {
	name: "Spanish",
	value: "es"
}, {
	name: "Japanese",
	value: "ja"
}]

const pokemonTest: Pokemon = {
	height: 19,
	id: 323,
	name: "camerupt",
	order: 434,
	sprites: {
		front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/323.png",
		front_shiny: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/323.png"
	},
	types: [{
		slot: 1,
		name: "fire"
	}, {
		slot: 2,
		name: "ground"
	}],
	weight: 2200,
	flavors: [{
		language: "en",
		text: "The humps on Camerupt’s back are formed by a transformation of its bones. They sometimes blast out molten magma. This Pokémon apparently erupts often when it is enraged."
	}, {
		language: "es",
		text: "Las jorobas de Camerupt se originaron por una deformación de los huesos. A veces escupen magma líquido, sobre todo cuando el Pokémon se enfada."
	}, {
		language: "ja",
		text: "背中の　コブは　骨が　形を　変えたもの。煮えたぎった　マグマを　時々　噴き上げる。怒った　ときに　よく　噴火する　らしい。"
	}]
}

const getColor = (pokemon: Pokemon) => {
	const type = pokemon.types[0].name;
	return POKEMON_TYPES.filter(pokeType => pokeType.name === type)[0].color;
}

const getShinyChance = (pokemon: Pokemon) => {
	const shinyChance = Math.floor(Math.random() * 100) + 1;
	return shinyChance <= 1 ? pokemon.sprites.front_shiny : pokemon.sprites.front_default;
}

const getPattern = (pokemon: Pokemon) => {
	const type = pokemon.types[0].name;
	return `https://raw.githubusercontent.com/ddumst/pokecalendar-bot/master/src/assets/patterns/${type}-pattern.png`;
}

const getFlavorText = (pokemon: Pokemon, language: string) => {
	const flavor = pokemon.flavors.filter(flavor => flavor.language === language)[0];
	return flavor.text;
}

const getWeight = (pokemon: Pokemon) => {
	const weight = pokemon.weight / 10;
	return weight.toFixed(2);
}

const getHeight = (pokemon: Pokemon) => {
	const height = pokemon.height / 10;
	return height.toFixed(2);
}

const getTypes = (pokemon: Pokemon) => {
	const types = pokemon.types.map(type => type.name.charAt(0).toUpperCase() + type.name.slice(1));
	const typesString = types.join(' / ');
	return typesString;
}

export const Birthday: Command = {
	name: "birthday",
	description: "Generates a Pokemon image for your birthday",
	type: ApplicationCommandType.ChatInput,
	options: [
		{ name: "day", description: "Day of your birthday", type: ApplicationCommandOptionType.String, required: true },
		{ name: "month", description: "Month of your birthday", type: ApplicationCommandOptionType.String, required: true },
		{
			name: "language",
			description: "Choose your language",
			type: ApplicationCommandOptionType.String,
			choices: languages
		},
	],
	run: async (client: Client, interaction: CommandInteraction) => {
		if (interaction.options.get("day")?.value) {
			const day = interaction.options.get("day")?.value?.toString();
			const month = interaction.options.get("month")?.value?.toString() || '01';
			const languageValue = interaction.options.get("language")?.value?.toString() || "en";

			// validate day has 2 digits and not exceed 31
			const regex = /^(0[1-9]|[12][0-9]|3[01])$/;

			// validate month has 2 digits and not exceed 12
			const regexMonth = /^(0[1-9]|1[012])$/;

			// Get language name from langeuage array and language value
			const languageName = languages.find(language => language.value === languageValue)?.name;

			// Get the author data
			const authorName = interaction.user.username;
			const authorId = interaction.user.id;
			const authorAvatar = interaction.user.avatarURL();

			// Get month name by month number
			const monthName = new Date(2021, parseInt(month) - 1, 1).toLocaleString(languageValue, { month: "long" });

			if (!regex.test(day || "")) {
				return interaction.followUp({
					ephemeral: true,
					content: "Please enter a valid day in the format DD",
				});
			}

			if (!regexMonth.test(month || "")) {
				return interaction.followUp({
					ephemeral: true,
					content: "Please enter a valid month in the format MM",
				});
			}

			await interaction.followUp({
				ephemeral: false,
				content: `We will generate a Pokemon image for your birthday ${day}/${month} in ${languageName}`,
			});

			try {
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
									width: 1080px;
								}
								.overlay {
									background-image: url({{pattern}});
									inset: 0;
									position: absolute;
									z-index: 1;
								}
								img.pokemon {
									position: absolute;
									height: 80%;
									right: 1rem;
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
						imageSource: getShinyChance(pokemonTest),
						pattern: getPattern(pokemonTest),
						authorName: authorName,
						name: pokemonTest.name,
						color: getColor(pokemonTest),
						birthday: `${monthName} ${day}`,
						height: getHeight(pokemonTest),
						weight: getWeight(pokemonTest),
						types: getTypes(pokemonTest),
						flavor: getFlavorText(pokemonTest, languageValue),
						authorAvatar: authorAvatar,
						opaqueColor: chroma(getColor(pokemonTest)).alpha(.75).css(),
					},
					puppeteerArgs: { args: ['--no-sandbox'] }
				});

				const attachment = new AttachmentBuilder(image as string, { name: `pokemon-${authorName}.png` });

				await interaction.editReply({
					content: `Happy birthday <@${authorId}>!`,
					files: [attachment]
				}
				);

			} catch (err) {
				console.log("Error generating image: ", err);
				interaction.followUp("Error generating image: " + err)
			}


		}
	},
};
