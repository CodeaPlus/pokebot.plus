import { CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType, AttachmentBuilder } from "discord.js";
import { Command } from "../Command";
import nodeHtmlToImage from 'node-html-to-image';
import chroma from 'chroma-js';
import { pokemonTest } from "../utils/pokemon-dummy";
import { regexDay, regexMonth, getShinyChance, getPattern, getColor, getHeight, getWeight, getTypes, getFlavorText } from "../utils/pokemon.utils";
import { languages } from '../domain/pokemon.interface';

const birthdayQueue = new Map();

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
		if (birthdayQueue.has(interaction.user.id)) {
			interaction.followUp({
				ephemeral: false,
				content: "You already have a birthday in the queue",
			});
			return;
		}

		if (interaction.options.get("day")?.value) {
			birthdayQueue.set(interaction.user.id, interaction);

			const day = interaction.options.get("day")?.value?.toString();
			const month = interaction.options.get("month")?.value?.toString() || '01';
			const languageValue = interaction.options.get("language")?.value?.toString() || "en";

			const pokemonName = pokemonTest.name
				.split(" ")
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(" ");

			const authorName = interaction.user.username;
			const authorId = interaction.user.id;
			const authorAvatar = interaction.user.avatarURL();

			const monthName = new Date(2021, parseInt(month) - 1, 1).toLocaleString(languageValue, { month: "long" });

			if (!regexDay.test(day || "")) {
				birthdayQueue.delete(interaction.user.id);

				return interaction.followUp({
					ephemeral: true,
					content: "Please enter a valid day in the format DD",
				});
			}

			if (!regexMonth.test(month || "")) {
				birthdayQueue.delete(interaction.user.id);

				return interaction.followUp({
					ephemeral: true,
					content: "Please enter a valid month in the format MM",
				});
			}

			await interaction.followUp({
				content: `...We are generating a Pokemon card based on <@${authorId}> birthday (${day}/${month})`,
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

				await interaction.followUp({
					content: `The pokemon for <@${authorId}> is **${pokemonName}**!`,
					files: [attachment]
				});
			} catch (err) {
				birthdayQueue.delete(interaction.user.id);
				interaction.followUp({
					ephemeral: true,
					content: `An error occurred while trying to generate your birthday card. Please try again later.`
				})
			} finally {
				birthdayQueue.delete(interaction.user.id);
			}
		}
	},
};
