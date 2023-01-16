import {
  ActionRowBuilder, 
  ButtonBuilder,
  ButtonStyle,
  MessageActionRowComponentBuilder
} from "discord.js";

export const birthday = new ActionRowBuilder<MessageActionRowComponentBuilder>()
  .addComponents(
    new ButtonBuilder()
      .setCustomId('loginweb3')
      .setLabel('Login 🐷💩!')
      .setStyle(ButtonStyle.Primary),
  );