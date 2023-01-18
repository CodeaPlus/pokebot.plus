import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageActionRowComponentBuilder
} from "discord.js";

export const optionButtons = new ActionRowBuilder<MessageActionRowComponentBuilder>()
  .addComponents(
    new ButtonBuilder()
      .setCustomId('yesnow')
      .setLabel('Get random Pokemon')
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId('notnow')
      .setLabel('Continue without description')
      .setStyle(ButtonStyle.Danger),
  );