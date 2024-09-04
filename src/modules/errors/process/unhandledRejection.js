import { ApplicationCommandType, Colors, ComponentType, EmbedBuilder, InteractionType, WebhookClient } from "discord.js"
import client from "../../../core/client.js"
import { Config } from "../../../util/constants.js"

export async function unhandledRejection(reason) {

  /**
   * 500 Internal Server Error
   * 10004 Unknown Guild
   * 10008 Unknown Message
   * 50035 Invalid Form Body (Error Handling Filter)
   * 50013 Missing Permissions
   * 11000 Duplicated Creating Document Mongoose - Ignore Error
   * 50001 DiscordAPIError: Missing Access
   * 10062 Unknow Interaction
   */

  if ([500, 10004, 10008, 10062, 50001, "GuildMembersTimeout"].includes(reason?.code)) return
  console.log('unhandledRejection', reason)

  const user = await client.users.fetch(Config.ownerId).catch(() => null)
  if (!user) return
  user.send({
    embeds: [{
      color: 0xff0000,
      title: '📢 Error Handler | UnhandledRejection',
      description: `\n\`\`\`js\n${reason.stack}\`\`\``.slice(0, 4096),
      footer: { text: `Error Code: ${reason.code || 0}` }

    }]
  }).catch(() => { })

}


export async function sendInteractionErrorToDiscordWebhook(interaction, error) {
  if (!client.isReady()) {
    console.error(error);
    return;
  }

  const commandName = [];

  if ("commandName" in interaction) {
    commandName.push(interaction.commandName);

    if ("getSubcommandGroup" in interaction.options) {
      const subCommandGroup = interaction.options.getSubcommandGroup(false);

      if (subCommandGroup) {
        commandName.push(subCommandGroup);
      }
    }

    if ("getSubcommand" in interaction.options) {
      const subCommand = interaction.options.getSubcommand(false);

      if (subCommand) {
        commandName.push(subCommand);
      }
    }

    commandName.push(interaction.commandId);
  }

  if ("customId" in interaction) {
    const parsedId = JSON.parse(interaction.customId);

    if (parsedId) {
      commandName.push(parsedId.c);

      if (parsedId.scg) {
        commandName.push(parsedId.scg);
      }

      if (parsedId.sc) {
        commandName.push(parsedId.sc);
      }
    }
  }

  const interactionType = [InteractionType[interaction.type]];

  if ("commandType" in interaction) {
    interactionType.push(ApplicationCommandType[interaction.commandType]);
  }

  if ("componentType" in interaction) {
    interactionType.push(ComponentType[interaction.componentType]);
  }

  const fields = [];

  if (interaction.guild) {
    fields.push({
      name: "Server",
      value: `${interaction.guild.nameAcronym} ${interaction.guild.name}`,
      inline: true,
    });
  }

  if (interaction.channelId) {
    fields.push({
      name: "Channel",
      value: `<#${interaction.channelId}>`,
      inline: true,
    });
  }

  try {
    const user = await client.users.fetch(Config.ownerId).catch(() => null)
    if (!user) return
    await user.send({
      embeds: [
        new EmbedBuilder()
          .addFields(fields.concat({
            name: "Author",
            value: `${interaction.user} ${interaction.user.tag} ${interaction.user.id}`,
          }, {
            name: "Command",
            value: "commandName" in interaction ?
              commandName.join(" > ") :
              `\`\`\`c\n${commandName.filter(c => c).join(" > ")}\n\`\`\``,
          }, {
            name: "Type",
            value: `\`\`\`c\n${interactionType.filter(i => i).join(" > ")}\n\`\`\``,
          }))
          .setColor(Colors.Red)
          .setDescription(`\`\`\`ts\n${error.stack}\n\`\`\``)
          .setTitle(`${error.name}: ${error.message}`.slice(0, 256))
          .setFooter("code" in error ? { text: `Error code: ${error.code}` } : null),
      ],
    });
  } catch (sendError) {
    console.error('Failed to send the error message to the user:', sendError);
  }
}
