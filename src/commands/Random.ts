import { CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType, AttachmentBuilder } from "discord.js";
import { Command } from "../Command";
import { regexDay, regexMonth } from "../utils/pokemon.utils";
import { languages } from '../domain/pokemon.interface';
import { GeneralEndpoints } from '../api/general.endpoints';
import { getPokemonImage } from "../helpers/pokemon.helpers";
import { optionButtons } from "../components/OptionButtons";

const birthdayQueue = new Map();

export const RandomPokemon: Command = {
  name: "random",
  description: "Generates a random Pokemon card for your birthday",
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

      const day = interaction.options.get("day")?.value?.toString() || '01';
      const month = interaction.options.get("month")?.value?.toString() || '01';
      const languageValue = interaction.options.get("language")?.value?.toString() || "en";

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

      const pokemon = await GeneralEndpoints.getRandomPokemon();

      await interaction.followUp({
        content: `...We are generating a random Pokemon card based on <@${authorId}> birthday (${day}/${month})`,
      });

      try {
        const { image, pokemonName } = await getPokemonImage(day, monthName, authorName, authorAvatar || '', languageValue, pokemon);
        const attachment = new AttachmentBuilder(image as string, { name: `pokemon-${authorName}.png` });

        await interaction.followUp({
          content: `The pokemon for <@${authorId}> is **${pokemonName}**!`,
          files: [attachment]
        }).then(async msg => {
          const attachment = msg.attachments.first();

          if (attachment) {
            const newUserCard = await GeneralEndpoints.insertUserCard({
              discordUserId: authorId,
              attachmentId: attachment.id,
              avatarUrl: authorAvatar || '',
              day: parseInt(day),
              image: attachment.url,
              month: parseInt(month),
              pokemonId: pokemon.id,
              type: pokemon.types[0].name,
              username: authorName
            })

            if (!newUserCard) {
              birthdayQueue.delete(interaction.user.id);
              interaction.followUp({
                ephemeral: true,
                content: `An error occurred while trying to generate your birthday card. Please try again later.`
              })
            }

            await interaction.followUp({
              content: `You can share this card on twitter!`,
              components: [optionButtons(attachment.id)],
              ephemeral: true
            })
          }
        });
      } catch (err) {
        console.log(err)
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
