import InviteManager from "discord-invite";
import client from '../../client.js';
const clientInviter = new InviteManager(client);
export { clientInviter }

client.on("memberJoin", async function (member, inviter, invite) {
  const logChannel = await client.channels.fetch('1194415819908731042')

  if (!inviter) {
    logChannel.send(`🇵🇹 | ${member} entrou no servidor, mas não consegui descobrir quem foi convidado.`);
  } else if (member.id == inviter.id) {
    logChannel.send(`🇵🇹 | ${member} Entrou no servidor por convite próprio!!`);
  } else if (member.guild.vanityURLCode == inviter) {
    logChannel.send(`🇵🇹 | ${member} Entrou usando Vanity URL!`);
  } else {
    clientInviter.inviteAdd(member.guild.id, inviter, 1);
    logChannel.send(`🇵🇹 | ${member} Entrou pelo convite do <@${inviter.id}>`);
  };
});