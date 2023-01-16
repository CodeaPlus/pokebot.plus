import { CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType, AttachmentBuilder } from "discord.js";
import { Command } from "../Command";
import nodeHtmlToImage from 'node-html-to-image';
import chroma from 'chroma-js';

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
									background-image: url("https://cdn.apg.gg/static/electric-pattern.png");
									inset: 0;
									position: absolute;
									z-index: 1;
								}
								img.pokemon {
									position: absolute;
									height: 80%;
									right: 1rem;
									z-index: 3;
								}
								.user-data {
									background-color: {{opaqueColor}};
									color: #FFF;
									font-size: 3rem;
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
								.user-data .author {
									font-size: 2.5rem
								}
								.user-data .birthday {
									font-size: 4rem
								}
							</style>
						</head>
						<body>
							<div class="overlay"></div>
							<div class="user-data">
								<div class="author">{{authorName}}</div>
								<div class="birthday">{{birthday}}</div>
							</div>
							<img class="pokemon" src="{{imageSource}}" />
						</body>
						</html>
					`,
					content: {
						imageSource: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
						authorName: authorName,
						color: '#ef70ef',
						birthday: `${monthName} ${day}`,
						opaqueColor: chroma('#ef70ef').darken(0.5).hex()
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
