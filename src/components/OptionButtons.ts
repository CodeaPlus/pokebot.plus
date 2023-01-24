import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageActionRowComponentBuilder
} from "discord.js";

export const optionButtons = (attachmentId: string) => {
  return new ActionRowBuilder<MessageActionRowComponentBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setURL(`https://twitter.com/intent/tweet?text=Checkout%20my%20Pokemon%20card%20generated%20by%20PokeBot&url=https://pokebot.online/share/${attachmentId}`)
        .setLabel('Share on twitter')
        .setStyle(ButtonStyle.Link),
    );
}